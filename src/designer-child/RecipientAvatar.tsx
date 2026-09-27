export default function RecipientAvatar({name,avatar,className=''}:{name:string;avatar?:string;className?:string}) {
  return <span className={`recipient-avatar primary ${className}`} aria-hidden="true">{avatar?<img src={avatar} alt=""/>:name.slice(0,1)}</span>;
}
