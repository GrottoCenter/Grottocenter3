/**
 * TEntrance.js
 *
 * @description :: tEntrance model
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 't_entrance',

  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
      columnName: 'id',
      unique: true,
    },

    author: {
      allowNull: false,
      columnName: 'id_author',
      model: 'TCaver',
    },

    reviewer: {
      columnName: 'id_reviewer',
      model: 'TCaver',
    },

    region: {
      type: 'string',
      columnName: 'region',
      maxLength: 100,
    },

    county: {
      type: 'string',
      columnName: 'county',
      maxLength: 100,
    },

    city: {
      type: 'string',
      columnName: 'city',
      maxLength: 100,
    },

    address: {
      type: 'string',
      allowNull: true,
      columnName: 'address',
      maxLength: 200,
    },

    yearDiscovery: {
      type: 'number',
      allowNull: true,
      columnName: 'year_discovery',
    },

    externalUrl: {
      type: 'string',
      allowNull: true,
      columnName: 'external_url',
      maxLength: 2000,
    },

    dateInscription: {
      type: 'ref',
      allowNull: false,
      columnName: 'date_inscription',
      columnType: 'datetime',
      defaultsTo: '2000-01-01 00:00:00',
    },

    dateReviewed: {
      type: 'ref',
      columnType: 'datetime',
      columnName: 'date_reviewed',
    },

    isPublic: {
      type: 'boolean',
      columnName: 'is_public',
    },

    isSensitive: {
      type: 'boolean',
      allowNull: false,
      columnName: 'is_sensitive',
      defaultsTo: false,
    },

    contact: {
      type: 'string',
      maxLength: 1000,
      columnName: 'contact',
      allowNull: true,
    },

    modalities: {
      type: 'string',
      allowNull: false,
      maxLength: 100,
      defaultsTo: 'NO,NO,NO,NO',
      columnName: 'modalities',
    },

    hasContributions: {
      type: 'boolean',
      allowNull: false,
      columnName: 'has_contributions',
      defaultsTo: false,
    },

    latitude: {
      type: 'string',
      allowNull: false,
      columnName: 'latitude',
      columnType: 'numeric(24,20)',
    },

    longitude: {
      type: 'string',
      allowNull: false,
      columnName: 'longitude',
      columnType: 'numeric(24,20)',
    },

    altitude: {
      type: 'number',
      columnName: 'altitude',
    },

    isOfInterest: {
      type: 'boolean',
      columnName: 'is_of_interest',
    },

    cave: {
      columnName: 'id_cave',
      model: 'TCave',
    },

    country: {
      columnName: 'id_country',
      model: 'TCountry',
    },

    geology: {
      columnName: 'id_geology',
      allowNull: false,
      model: 'TGeology',
    },
  },
};