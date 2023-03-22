import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const myCustomLightTheme = {
    dark: false,
    colors: {
        light_magenta: '#6750A4',
        light_brown: '#7D5260',
    }
}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'myCustomLightTheme',
        themes: {
            myCustomLightTheme,
        }
    },
    icons: {
        defaultSet: 'mdi',
    },
})

export default vuetify;