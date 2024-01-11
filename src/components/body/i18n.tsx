import { DownIcon } from '@/icons/header/Down'
import { useTranslation } from 'react-i18next'
import { type StoreType, usePlayerStore } from '@/store/playerStore'
export function I18nComponent () {
  const { setLanguage } = usePlayerStore<StoreType>((state) => state)
  const languages = [
    {
      name: 'English',
      code: 'EN',
      file: 'en'
    },
    {
      name: 'Español',
      code: 'ES',
      file: 'es'
    }
  ]
  const { i18n } = useTranslation()
  const currentLanguage = languages.find((lang) => lang.file === i18n.language)
  const changeLanguage = (language: string) => {
    setLanguage(language)
  }

  return (
    <div className="relative inline-block text-left mr-4">
      <div className="group text-white rounded-md font-semibold bg-black/40 hover:bg-black/70 transition-all">
        <button
          type="button"
          className="inline-flex justify-start items-center w-full gap-x-2 px-3 py-1 text-base"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {currentLanguage !== undefined ? currentLanguage.code : 'N/A'}
          <DownIcon />
        </button>
        <ul className="group-hover:block group-hover:animate-fade-down group-hover:animate-duration-200 hidden pt-0.5 absolute w-full">
          {languages.map((language) => (
            <li key={language.name}>
              <button
                className="rounded-md bg-black/40 hover:bg-black/70 whitespace-no-wrap inline-flex justify-start items-center w-full gap-x-2 px-3 py-2 text-xs"
                onClick={() => {
                  changeLanguage(language.file)
                }}
              >
                {language.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
