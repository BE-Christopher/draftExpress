import * as passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../models/entities';
import UserDataQuery from '../models/dataQueries/base/User.base.dataQueries';
import { NextFunction, Request, Response } from 'express';
import configuration from "../config";

interface JWTPayload {
    id: string;
}

class Authentication {
    constructor() {
        this.initialize();
    }

    private initialize() {
        const options = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configuration.passportSecretKey
        };

        passport.use(
            new JwtStrategy(
                options,
                async (payload: JWTPayload, done) => {
                    try {
                        const userQuery = new UserDataQuery();
                        const user: User | null = await userQuery.getOne({ options: { id: Number(payload?.id) } });

                        if (!user) {
                            return done(null, false);
                        }
                        return done(null, user);
                    } catch (error) {
                        return done(null, false);
                    }
                }
            )
        );
    }

    public authenticate(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({ message: 'Unauthorize' });
            }

            req.user = user;
            next();
        })(req, res, next);
    }
}

export default new Authentication();
