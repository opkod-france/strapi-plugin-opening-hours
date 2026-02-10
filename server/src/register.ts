export const register = ({ strapi }: any) => {
  strapi.customFields.register({
    name: 'opening-hours',
    plugin: 'opening-hours',
    type: 'json',
  });
};
