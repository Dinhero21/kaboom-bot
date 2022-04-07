const sleep = require('atomic-sleep')

module.exports = {
  chat: async handler => {
      handler.tellraw([
          {
              text: 'There are ',
              color: 'green' // TODO: Add to colors
          },
          {
              text: 0,
              color: 'white' // TODO: Add to colors
          },
          {
              text: ' people living in mars right now.',
              color: 'green' // TODO: Add to colors
          }
      ])
  },
  name: 'howmanypeoplearelivingonmars',
  description: 'Will request to an api how many people are there in mars right now.',
  usage: 'howmanypeoplearelivingonmars',
  trust: 0,
  enabled: true
}