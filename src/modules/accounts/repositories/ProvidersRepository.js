const { Provider } = require('../models/Provider');
const { Op } = require('sequelize');

class ProvidersRepository {
  async create({ user_id }) {
    const provider = await Provider.create({
      user_id,
      active: true,
    });

    return provider;
  }

  async findAll({ name = '', state = '', city = '' }) {
    // adiciona as opções de filtragem de endereço;
    let whereAddress = {};
    if (state && state.trim()) {
      whereAddress.state = {
        [Op.iLike]: `%${state}%`,
      };
    }

    if (city && city.trim()) {
      whereAddress.city = {
        [Op.iLike]: `%${city}%`,
      };
    }

    if (Object.keys(whereAddress).length === 0) {
      whereAddress = null;
    }

    return await Provider.findAll({
      include: [
        {
          association: 'user',
          attributes: ['name', 'email', 'phone'],
          where: {
            name: {
              [Op.iLike]: `%${name}%`,
            },
          },
        },
        {
          association: 'address',
          attributes: [
            'zip_code',
            'street',
            'neighborhood',
            'city',
            'state',
            'country',
          ],
          where: whereAddress,
        },
      ],
    });
  }

  async findById(id) {
    return await Provider.findOne({ where: { id } });
  }

  async findByUserId(user_id) {
    return await Provider.findOne({ where: { user_id } });
  }

  async updateProviderAddress({ provider_id, address_id }) {
    return await Provider.update(
      { address_id },
      { where: { id: provider_id } },
    );
  }
}

module.exports = { ProvidersRepository };
