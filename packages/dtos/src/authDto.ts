export interface SharedLoginDto {
  email: string;
  password: string;
}

export interface SharedSignUpDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SharedEmailDto {
  email: string;
}

export interface SharedPasswordDto {
  password: string;
}

export interface SharedTokenDto {
  token: string;
}
