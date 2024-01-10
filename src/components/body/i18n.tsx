import { DownIcon } from '@/icons/header/Down'
import { FlagSpain } from '../../icons/i18n/flags/Spain'
import { useTranslation } from 'react-i18next'
export function I18nComponent () {
  const languages = [
    {
      name: 'EN',
      file: 'en',
      flag: FlagSpain
    },
    {
      name: 'ES',
      file: 'es',
      flag: FlagSpain
    }
  ]
  const { i18n } = useTranslation()
  const currentLanguage = languages.find((lang) => lang.file === i18n.language)
  const changeLanguage = (language: string) => {
    void i18n.changeLanguage(language)
  }
  return (
    <div className="relative inline-block text-left">
      <div className="group text-white rounded-md text-xs font-semibold bg-black/30 hover:bg-black/70 transition-all">
        <button
          type="button"
          className="inline-flex justify-start items-center w-full gap-x-2 px-3 py-2"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {currentLanguage !== undefined ? <currentLanguage.flag /> : null}
          {currentLanguage !== undefined ? currentLanguage.name : 'Idioma'}
          <DownIcon />
        </button>
        <ul className="group-hover:block group-hover:animate-fade-down group-hover:animate-duration-200 hidden pt-0.5 absolute w-full">
          {languages.map((language) => (
            <li key={language.name}>
              <button
                className="rounded-md bg-black/30 hover:bg-black/70 whitespace-no-wrap inline-flex justify-start items-center w-full gap-x-2 px-3 py-2"
                onClick={() => {
                  changeLanguage(language.file)
                }}
              >
                <language.flag />
                {language.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
