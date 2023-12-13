interface SideMenuType {
  Icon: any
  text: string
  href: string
  handledFunction?: () => void
}

export default function SideMenuItem ({ Icon, text, href, handledFunction }: SideMenuType) {
  return (
    <li>
      <a
        className="flex gap-4 text-zinc-400 hover:text-zinc-100 items-center py-3 px-5 font-medium transition duration-300"
        href={href}
        onClick={handledFunction}
      >
        <Icon />
        {text}
      </a>
    </li>
  )
}
