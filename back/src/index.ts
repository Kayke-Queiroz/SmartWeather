import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const existingPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
          where: {
            role: publicRole.id,
            action: { $startsWith: 'api::weather-record.weather-record.' }
          }
        });

        const actions = [
          'api::weather-record.weather-record.find',
          'api::weather-record.weather-record.findOne',
          'api::weather-record.weather-record.create',
          'api::weather-record.weather-record.update',
          'api::weather-record.weather-record.delete',
        ];

        const existingActions = existingPermissions.map(p => p.action);
        const actionsToCreate = actions.filter(a => !existingActions.includes(a));

        for (const action of actionsToCreate) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action,
              role: publicRole.id,
            }
          });
        }
        strapi.log.info('Public permissions for weather-record configured.');
      }
    } catch (err) {
      strapi.log.error('Error setting up permissions:', err);
    }
  },
};
