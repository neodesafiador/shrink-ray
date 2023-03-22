import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';

const linkRepository = AppDataSource.getRepository(Link);

async function getLinkById(linkId: string): Promise<Link[] | null> {
  // The getMany function will return null if the linkId doesn't match an account
  const links = await linkRepository
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.user', 'link')
    .where('link.linkId = :linkId', { linkId })
    .getMany();

  return links;
}

export { getLinkById };
