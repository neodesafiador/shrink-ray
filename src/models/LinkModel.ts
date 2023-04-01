import { createHash } from 'crypto';
import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';
import { User } from '../entities/User';

const linkRepository = AppDataSource.getRepository(Link);

async function getLinkById(linkId: string): Promise<Link | null> {
  // The getMany function will return null if the linkId doesn't match an account
  const link = await linkRepository
    .createQueryBuilder('link')
    .where({ linkId })
    .select(['link.linkId', 'link.originalUrl', 'link.isAccessedOn', 'link.numHit', 'link.user'])
    .getOne();

  return link;
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

async function updateLinkVisits(link: Link): Promise<Link> {
  // Increment the link's number of hits property
  let updatedLink = link;
  // Create a new date object and assign it to the link's `lastAccessedOn` property
  const updatedDate = new Date();
  // Update the link's numHits and lastAccessedOn in the database
  updatedLink.numHits += 1;
  updatedLink.lastAccessedOn = updatedDate;

  updatedLink = await linkRepository.save(updatedLink);

  return updatedLink;
}

async function getLinksByUserId(userId: string): Promise<Link[]> {
  const links = await linkRepository
    .createQueryBuilder('link')
    .where({ user: { userId } })
    .leftJoin('link.user', 'user')
    .select(['link.linkId', 'link.originalUrl', 'user.userId', 'user.username'])
    .getMany();

  return links;
}

async function getLinksByUserIdForOwnAccount(userId: string): Promise<Link[]> {
  const links = await linkRepository
    .createQueryBuilder('link')
    .where({ user: { userId } })
    .leftJoin('link.user', 'user')
    .select([
      'link.linkId',
      'link.originalUrl',
      'link.numHits',
      'link.lastAccessedOn',
      'user.userId',
      'user.username',
      'user.isPro',
      'user.isAdmin',
    ])
    .getMany();

  return links;
}

export {
  getLinkById,
  createLinkId,
  createNewLink,
  updateLinkVisits,
  getLinksByUserId,
  getLinksByUserIdForOwnAccount,
};
