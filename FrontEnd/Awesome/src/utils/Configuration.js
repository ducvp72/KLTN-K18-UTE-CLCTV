import moment from "moment";

export const baseUrl = "http://chatapp-api.eastasia.cloudapp.azure.com:5000/v1";
// export const baseUrl = "192.168.180.2:5000/v1";
export const socketUrl = "http://chatapp-api.eastasia.cloudapp.azure.com:8000";
export const APP_NAME = "videocalling";
export const ACC_NAME = "builam66";

export const Configuration = {
  home: {
    tab_bar_height: 50,
    initial_show_count: 4,
    listing_item: {
      height: 130,
      offset: 15,
      saved: {
        position_top: 5,
        size: 25,
      },
    },
  },
  map: {
    origin: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
    delta: {
      latitude: 0.0422,
      longitude: 0.0221,
    },
  },
  timeFormat: (postTime) => {
    time = "";
    if (postTime) {
      time = moment(postTime).fromNow();
    }
    // time = postTime.toUTCString();
    return time;
  },
};
