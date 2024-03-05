import * as jose from "jose";

export default defineNuxtPlugin((_app) => {
  const { $router } = useNuxtApp();

  const config = useRuntimeConfig().public;

  const valid_phone = config.validPhone;
  const secret = new TextEncoder().encode(config.jwt);

  function getRandomArbitrary(min = 1, max = 3) {
    return Math.random() * (max - min) + min;
  }

  async function createToken(phone: string) {
    const alg = "HS256";
    const token = await new jose.SignJWT({ phone })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("5h")
      .sign(secret);
    localStorage.setItem("auth-token", token);
  }

  return {
    provide: {
      auth: {
        login(phone: string) {
          return new Promise<boolean>((resolve) => {
            setTimeout(() => {
              const ok = phone === valid_phone;
              if (ok) {
                createToken(phone);
              } else {
                localStorage.removeItem("auth-token");
              }
              resolve(ok);
            }, getRandomArbitrary() * 1000);
          });
        },
        logout() {
          localStorage.removeItem("auth-token");
          $router.push("/");
        },
        async checkToken() {
          const token = localStorage.getItem("auth-token");

          if (token) {
            try {
              const { payload } = await jose.jwtVerify(token, secret);
              if (payload.exp) {
                const token_date = new Date(payload.exp * 1000);
                const now = new Date();
                if (token_date > now) {
                  const pl = payload as any;
                  return pl.phone;
                } else {
                  return "";
                }
              } else {
                return "";
              }
            } catch (err) {
              localStorage.removeItem("auth-token");
              if (err instanceof jose.errors.JWTExpired) {
                console.log(err.message);
              }
              return "";
            }
          } else {
            return "";
          }
        },
      },
    },
  };
});
