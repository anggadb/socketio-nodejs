'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'Angga Bachtiar',
      password: 'user',
      email: 'bachtiar.angga@gmail.com',
      nik: '14523259',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Ajeng Dwi Osaki',
      password: 'user',
      email: 'ajeng@osaki.co.id',
      nik: '14523260',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Ridho Afwan',
      password: 'user',
      email: 'ridho@afwan.co.af',
      nik: '14523258',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
