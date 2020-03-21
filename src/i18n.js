import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'

let language = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || '';

language = /zh.*CN/i.test(language) ? 'zh' : 'en';
Vue.use(VueI18n);

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return {
    en: {
      ...messages['en'],
      ...enLocale
    },
    zh: {
      ...messages['zh'],
      ...zhLocale
    }
  }
}

const i18n = new VueI18n({
  locale: language,
  fallbackLocale: language,
  messages: loadLocaleMessages()
});

ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
