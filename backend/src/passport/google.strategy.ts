// backend/src/passport/google.strategy.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import prismaNewClient from '../lib/prisma';
import { Request } from 'express';
import { User } from '../../generated/prisma';
import { AuthService } from '../services/auth.service';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      passReqToCallback: true,
    },
    async (
      _req: Request,
      accessToken: string,
      refreshToken: string,
      profile: passport.Profile,
      done: (_error: Error | null, _user?: User) => void
    ) => {
      if (!profile.emails || profile.emails.length === 0) {
        return done(new Error('No email found'), undefined);
      }

      try {
        const googleId = profile.id;

        const email = profile.emails[0].value;
        const defaultName = profile.displayName ?? email.split('@')[0];

        const newUser = {
          googleId,
          firstName: profile.name?.givenName ?? defaultName,
          lastName: profile.name?.familyName ?? defaultName,
          username: profile.username ?? defaultName,
          email,
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken,
          avatar: profile.photos?.[0]?.value ?? null,
          role: ['passenger'],
          credits: 20,
        };

        let user =
          (await prismaNewClient.user.findUnique({
            where: { googleId },
          })) ??
          (await prismaNewClient.user.create({
            data: newUser,
          }));

        const jwtToken = AuthService.signToken({
          id: user.id,
          email,
        });
        await AuthService.updateUserToken(user.id, jwtToken);

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await prismaNewClient.user.findUnique({ where: { id } });
  done(null, user);
});
