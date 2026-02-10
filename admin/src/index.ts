import { OpeningHoursIcon } from './components/OpeningHoursIcon';
import { pluginId } from './pluginId';
import { getTrad } from './utils/getTrad';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'opening-hours',
      pluginId: 'opening-hours',
      type: 'json',
      icon: OpeningHoursIcon,
      intlLabel: {
        id: getTrad('opening-hours.label'),
        defaultMessage: 'Opening Hours',
      },
      intlDescription: {
        id: getTrad('opening-hours.description'),
        defaultMessage: 'Define business opening hours with support for split shifts and special hours',
      },
      components: {
        Input: async () =>
          import('./components/OpeningHoursInput').then((module) => ({
            default: module.OpeningHoursInput,
          })),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('opening-hours.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('opening-hours.options.advanced.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
  },
  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
