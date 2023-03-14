import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class Link {
  @PrimaryColumn()
  linkId: string;

  @Column()
  originalUrl: string;

  @Column()
  lastAccessedOn: Date;

  @Column({ default: 0 })
  numHits: number;

  @OneToOne(() => User, (user) => user.link)
  @JoinColumn()
  user: Relation<User>;
}
