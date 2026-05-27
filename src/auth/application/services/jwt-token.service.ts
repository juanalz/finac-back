import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac, timingSafeEqual } from "crypto";
import { AuthenticatedUser } from "../../domain/authenticated-user";
import { Role } from "../../domain/role.enum";

type JwtPayload = AuthenticatedUser & {
  iat: number;
  exp: number;
};

@Injectable()
export class JwtTokenService {
  constructor(private readonly configService: ConfigService) {}

  sign(user: AuthenticatedUser): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: JwtPayload = {
      ...user,
      iat: now,
      exp: now + this.expiresInSeconds(),
    };

    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signature = this.signContent(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verify(token: string): AuthenticatedUser {
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException("Invalid token");
    }

    const expectedSignature = this.signContent(
      `${encodedHeader}.${encodedPayload}`,
    );
    if (!this.safeEquals(signature, expectedSignature)) {
      throw new UnauthorizedException("Invalid token");
    }

    let payload: JwtPayload;
    try {
      payload = JSON.parse(this.base64UrlDecode(encodedPayload)) as JwtPayload;
    } catch {
      throw new UnauthorizedException("Invalid token payload");
    }
    const now = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < now) {
      throw new UnauthorizedException("Token expired");
    }

    if (
      !payload.sub ||
      !payload.username ||
      !Object.values(Role).includes(payload.role)
    ) {
      throw new UnauthorizedException("Invalid token payload");
    }

    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }

  private signContent(content: string): string {
    return createHmac("sha256", this.secret())
      .update(content)
      .digest("base64url");
  }

  private safeEquals(a: string, b: string): boolean {
    const first = Buffer.from(a);
    const second = Buffer.from(b);
    return first.length === second.length && timingSafeEqual(first, second);
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value).toString("base64url");
  }

  private base64UrlDecode(value: string): string {
    return Buffer.from(value, "base64url").toString("utf8");
  }

  private secret(): string {
    return (
      this.configService.get<string>("accessTokenSecret") ??
      "finac-local-secret"
    );
  }

  private expiresInSeconds(): number {
    const raw =
      this.configService.get<string>("accessTokenExpiresIn") ?? "30Min";
    const match = raw.match(/^(\d+)\s*(s|sec|m|min|h|d)?$/i);
    if (!match) return 30 * 60;

    const value = Number(match[1]);
    const unit = (match[2] ?? "s").toLowerCase();

    if (["m", "min"].includes(unit)) return value * 60;
    if (unit === "h") return value * 60 * 60;
    if (unit === "d") return value * 24 * 60 * 60;
    return value;
  }
}
