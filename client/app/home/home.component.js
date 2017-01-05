'use strict';

const angular = require('angular');
const uiRouter = require('angular-ui-router');

import routes from './home.routes';
import currentPollRoomService from '../current-poll-room/current-poll-room.service';

export class HomeComponent {

  /*@ngInject*/
  constructor($http, Auth, currentPollRoom) {
    this.$http = $http;
    this.currentPollRoom = currentPollRoom;
    this.pollRooms = [];
    this.currentPresenterPollRooms = [];
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.getPollRooms();
  }

  getPollRooms() {
    this.$http.get('/api/poll-rooms').then(response => {
      this.pollRooms = response.data;
      this.getCurrentPresenterPollRooms();
    });
  }

  getCurrentPresenterPollRooms() {
    var currentPresenterId = this.getCurrentUser()._id;
    for(var i=0; i < this.pollRooms.length; i++) {
      if (this.pollRooms[i].presenterId == currentPresenterId) {
        this.currentPresenterPollRooms.push(this.pollRooms[i]);
      }
    }
  }

  // Set the the poll room to administer in the service
  administer(pollRoom) {
    this.currentPollRoom.setCurrentPollRoom(pollRoom);
  }

}

export default angular.module('heigvdTwebFreasyPollApp.home', [uiRouter, currentPollRoomService])
  .config(routes)
  .component('home', {
    template: require('./home.html'),
    controller: HomeComponent,
    controllerAs: 'homeCtrl'
  })
  .name;
