import { Crypt } from "@shared/util/Crypto";
import Email from "@user/domain/valueObject/Email";
import { UserType } from "@user/domain/enum/UserType";
import { CreateUserDTO, UpdateUserDTO } from "@user/api/UserDTO";
import { EventListener } from "@shared/event/EventListener";
import { UserUpdateEvent } from "@shared/event/UserUpdateEvent";

export default class User {
  constructor(
    private id: string,
    private username: string,
    private email: Email,
    private passwordHash: string | null = null,
    private bio: string = "default",
    private linkedin: string | null = null,
    private github: string | null = null,
    private website: string | null = null,
    private userType: UserType | null = UserType.USER,
    private contactEmail: string | null = null,
    private availableForHire: boolean = false,
    private active: boolean = true,
  ) {}

  public static async create(dto: CreateUserDTO) {
    let hashedPassword: string | null = null;

    if (dto.password) hashedPassword = await Crypt.hashPassWord(dto.password);

    return new User(
      "",
      dto.username,
      new Email(dto.email),
      hashedPassword,
      dto.bio,
      dto.linkedin,
      dto.github,
      dto.website,
      dto.userType,
      dto.contactEmail,
      dto.availableForHire
    );
  }

  public async update(dto: UpdateUserDTO): Promise<void> {
    let emailChanged = false;

    if (dto.username !== undefined) {
      this.username = dto.username;
    }

    if (dto.email !== undefined) {
      emailChanged = dto.email !== this.email.getValue();
      this.email = new Email(dto.email);
    }

    if (dto.bio !== undefined) {
      this.bio = dto.bio;
    }

    if (dto.linkedin !== undefined) {
      this.linkedin = dto.linkedin;
    }

    if (dto.github !== undefined) {
      this.github = dto.github;
    }

    if (dto.website !== undefined) {
      this.website = dto.website;
    }

    if (dto.contactEmail !== undefined) {
      this.contactEmail = dto.contactEmail;
    }

    if (dto.availableForHire !== undefined) {
      this.availableForHire = dto.availableForHire;
    }

    const event = new UserUpdateEvent(
      this.id,
      this.username,
      this.email.getValue(),
      emailChanged
    );
    EventListener.publish(event);
  }

  public async comparePassword(password: string): Promise<boolean> {
    if (!this.passwordHash) return false;

    return await Crypt.compare(password, this.passwordHash);
  }

  public getPassword(): string | null {
    return this.passwordHash;
  }

  public getId(): string {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getBio(): string {
    return this.bio;
  }

  public getLinkedin(): string | null {
    return this.linkedin;
  }

  public getGithub(): string | null {
    return this.github;
  }

  public getWebsite(): string | null {
    return this.website;
  }

  public getUserType(): UserType | null {
    return this.userType;
  }

  public getContactEmail(): string | null {
    return this.contactEmail;
  }

  public isAvailableForHire(): boolean {
    return this.availableForHire;
  }

  public isActive(): boolean {
    return this.active;
  }

  public setActive(active: boolean): void {
    this.active = active;
  }
}
