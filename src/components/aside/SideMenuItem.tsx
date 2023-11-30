interface SideMenuType {
  Icon: any
  text: string
  href: string
}

export default function SideMenuItem ({ Icon, text, href }: SideMenuType) {
  return (
<li>
      <a
        className='flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition duration-300'
        href={href}
      >
        <Icon />
        {text}
      </a>
</li>
  )
}
