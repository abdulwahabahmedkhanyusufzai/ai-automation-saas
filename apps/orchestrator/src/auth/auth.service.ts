import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret-here';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async signup(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 14);

    try {
      await this.db.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, hashedPassword]
      );
      return { message: 'User created successfully' };
    } catch (err: any) {
      if (err.code === '23505') { // Unique violation
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Database error');
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      const res = await this.db.query('SELECT id, password FROM users WHERE email = $1', [email]);
      if (res.rows.length === 0) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = res.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });

      return {
        message: 'Login successful',
        token,
      };
    } catch (err: any) {
      if (err instanceof UnauthorizedException || err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Server error');
    }
  }

  async googleLogin(token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    try {
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      if (!googleRes.ok) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const payload = await googleRes.json();
      const email = payload.email;

      if (!email) {
        throw new UnauthorizedException('Google token missing email');
      }

      // Check if user exists, otherwise create
      const selectRes = await this.db.query('SELECT id FROM users WHERE email = $1', [email]);
      
      if (selectRes.rows.length === 0) {
        await this.db.query(
          'INSERT INTO users (email, password) VALUES ($1, $2)',
          [email, 'google-authenticated-user-no-password']
        );
      }

      const localToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });

      return {
        message: 'Google Login successful',
        token: localToken,
      };
    } catch (err: any) {
      if (err instanceof UnauthorizedException || err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException('Google auth verification failed');
    }
  }

  async githubLogin(code: string) {
    if (!code) {
      throw new BadRequestException('Code is required');
    }

    const clientID = GITHUB_CLIENT_ID.trim();
    const clientSecret = GITHUB_CLIENT_SECRET.trim();

    if (!clientID || !clientSecret) {
      throw new InternalServerErrorException('GitHub OAuth is not configured');
    }

    try {
      // 1. Exchange code for access token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientID,
          client_secret: clientSecret,
          code,
        }),
      });

      if (!tokenRes.ok) {
        throw new UnauthorizedException('GitHub token exchange failed');
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new UnauthorizedException(tokenData.error_description || 'GitHub OAuth failed');
      }

      // 2. Fetch user profile
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
          'User-Agent': 'BistroOS-Backend',
        },
      });

      if (!userRes.ok) {
        throw new UnauthorizedException('Failed to fetch GitHub user');
      }

      const githubUser = await userRes.json();
      let email = githubUser.email;

      // 3. Fetch emails if private
      if (!email) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${accessToken}`,
            'User-Agent': 'BistroOS-Backend',
          },
        });

        if (emailsRes.ok) {
          const emails = await emailsRes.json();
          const primaryEmailObj = emails.find((e: any) => e.primary);
          if (primaryEmailObj) {
            email = primaryEmailObj.email;
          }
        }
      }

      if (!email) {
        throw new BadRequestException('GitHub primary email not found');
      }

      // 4. Check/Sync user
      const selectRes = await this.db.query('SELECT id FROM users WHERE email = $1', [email]);
      
      if (selectRes.rows.length === 0) {
        await this.db.query(
          'INSERT INTO users (email, password) VALUES ($1, $2)',
          [email, 'github-auth-no-password']
        );
      }

      // 5. Issue JWT
      const localToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });

      return {
        message: 'GitHub Login successful',
        token: localToken,
      };
    } catch (err: any) {
      if (err instanceof UnauthorizedException || err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException(err.message || 'GitHub Login failed');
    }
  }
}
