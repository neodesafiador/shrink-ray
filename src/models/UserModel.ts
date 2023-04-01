import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function getUserByUsername(username: string): Promise<User | null> {
  // Get the user by where the username matches the parameter
  // This should also retrieve the `links` relation
  // The getOne function will return null if the userId doesn't match an account
  const user = await userRepository
    .createQueryBuilder('user')
    .where({ username })
    .select([
      'user.userId',
      'user.username',
      'user.passwordHash',
      'user.isPro',
      'user.isAdmin',
      'user.links',
    ])
    .getOne();

  return user;
}

async function addNewUser(username: string, passwordHash: string): Promise<User | null> {
  // Add the new user to the database
  let newUser = new User();
  newUser.username = username;
  newUser.passwordHash = passwordHash;

  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserById(userId: string): Promise<User | null> {
  // The getOne function will return null if the userId doesn't match an account
  const user = await userRepository.createQueryBuilder('user').where({ userId }).getOne();

  return user;
}

export { getUserByUsername, addNewUser, getUserById };
