import { createHash } from 'crypto';
import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';
import { User } from '../entities/User';

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
  // Get only the first 9 characters of `urlHash`
  const linkId = urlHash.slice(0, 9);

  return linkId;
}

async function createNewLink(originalUrl: string, linkId: string, creator: User): Promise<Link> {
  let newLink = new Link();
  const date: Date = new Date();

  newLink.originalUrl = originalUrl;
  newLink.linkId = linkId;
  newLink.lastAccessedOn = date;
  newLink.numHits = 0;
  newLink.user = creator;

  newLink = await linkRepository.save(newLink);

  return newLink;
}

export { getLinkById, createLinkId, createNewLink };
