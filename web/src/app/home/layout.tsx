import Branding from "../(serverComponents)/Branding"
import Header from "../(serverComponents)/Header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=' flex-col  bg-theme-dark text-theme-white h-dvh w-full '>
      <Header />

      <main className="pt-[45px] px-5">
        <section>
          <Branding />
        </section>

        <section className='py-3 w-full lg:w-8/12 mx-auto'>
          趋势预测模块
        </section>
        <section className="vedios py-3 w-full lg:w-8/12 mx-auto">
          {children}
        </section>
      </main>
      <footer className="px-5 py-3 w-full text-center text-theme-white/50">
        power by MxM_Ai
      </footer>
    </div>
  )
}

