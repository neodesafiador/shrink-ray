import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';

const linkRepository = AppDataSource.getRepository(Link);

async function getLinkById(linkId: string): Promise<Link[] | null> {
  if (!linkId) {
    return null;
  }
  const links = await linkRepository
    .createQueryBuilder('link')
    .leftJoinAndSelect('link.user', 'link')
    .where('link.linkId = :linkId', { linkId })
    .getMany();

  return links;
}

export { getLinkById };
