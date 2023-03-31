import { createHash } from 'crypto';
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

function createLinkId(originalUrl: string, userId: string): string {
  const md5 = createHash('md5');
  // Concatenate the original url and userId
  md5.update(`${originalUrl}${userId}`);
  const urlHash = md5.digest('base64url');
  const linkId = urlHash.slice(0, 9);

  return linkId;
}

export { getLinkById, createLinkId };
