declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      image?: string;
      isSeller: boolean;
    };
  }

  interface User {
    id: string;
    username: string;
    email: string;
    image?: string;
    isSeller: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    username: string;
    isSeller: boolean;
  }
}

export declare module "next-auth" {}
