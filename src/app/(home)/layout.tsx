import { MenuSidebar } from './_components/sidebar'

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className='bg-[#DFE4E7] h-full flex w-full'>
      <MenuSidebar />
      <div className='px-14 py-10 flex flex-col w-full h-full overflow-auto'>
        {children}
      </div>
    </div>
  )
}
