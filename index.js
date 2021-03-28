// Store all results here for easier access from the different functions
var results = {};

window.addEventListener("load", function() {

  function writeResult(type, outcome) {
    return function() {
      var argList = [outcome, type].concat([].slice.call(arguments));
      window.results[type] = outcome;
    }
  }

  function writeResultFn(type, outcome){
    window.results[type] = outcome;
  }

  function writeResultForNotifications(outcome) {
    window.results["notifications"] = outcome;
  };

  function triggerDownload() {
    // Based on http://stackoverflow.com/a/27280611
    var a = document.createElement('a');
    a.download = "test-image.png";
    a.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAABC0lEQVQYlTXPPUsCYQDA8b/e04tdQR5ZBpE3NAR6S0SDVDZKDQ2BY9TUy1foE0TQ1Edo6hOEkyUG0QuBRtQgl0hnenVdnZD5eLbU7xv8Avy5X16KhrQBg47EtpziXO6qBhAEeNEm0qr7VdBcLxt2mlnNbhVu0NMAgdj1wvjOoX2xdSt0L7MGgx2GGid8yLrJvJMUkbKfOF8N68bUIqcz2wQR7GUcYvJIr1dFQijvkh89xGV6BPPMwvMF/nQXJMgWiM+KLPX2tc0HNa/HUxDv2owpx7xV+023Hiwpdt7yhmcjj9/NdrIhn8LrPVmotctWVd01Nt27wH9T3YhHU5O+sT/6SuVZKa4cNGoAv/ZMas7pC/KaAAAAAElFTkSuQmCC";
    a.click();
  }

  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
  navigator.requestFullscreen = (
    navigator.requestFullscreen ||
    navigator.webkitRequestFullscreen ||
    navigator.mozRequestFullscreen ||
    navigator.msRequestFullscreen
  );
  navigator.requestMIDIAccess = (
    navigator.requestMIDIAccess ||
    navigator.webkitRequestMIDIAccess ||
    navigator.mozRequestMIDIAccess ||
    navigator.msRequestMIDIAccess
  );
  document.body.requestFullScreen = (
    document.body.requestFullScreen ||
    document.body.webkitRequestFullScreen ||
    document.body.mozRequestFullScreen ||
    document.body.msRequestFullScreen
  );
  document.body.requestPointerLock = (
    document.body.requestPointerLock ||
    document.body.webkitRequestPointerLock ||
    document.body.mozRequestPointerLock ||
    document.body.msRequestPointerLock
  );

  var register = {
    "notifications": function () {
      Notification.requestPermission(
        writeResultForNotifications
      );
    },
    "location": function() {
      navigator.geolocation.getCurrentPosition(
        writeResult("location", "success"),
        writeResult("location", "error")
      );
    },
    "camera": function() {
      navigator.mediaDevices ?
        navigator.mediaDevices.getUserMedia(
          {video: true}).then(
            writeResult("camera", "success"),
            writeResult("camera", "error")
        ) :
        navigator.getUserMedia(
          {video: true},
          writeResult("camera", "success"),
          writeResult("camera", "error")
        );
    },
    "microphone": function() {
      navigator.mediaDevices ?
        navigator.mediaDevices.getUserMedia(
          {audio: true}).then(
            writeResult("microphone", "success"),
            writeResult("microphone", "error")
        ) :
        navigator.getUserMedia(
          {audio: true},
          writeResult("microphone", "success"),
          writeResult("microphone", "error")
        );
    },
    "camera+microphone": function() {
      navigator.mediaDevices ?
        navigator.mediaDevices.getUserMedia(
          {audio: true, video: true}).then(
            writeResult("camera+microphone", "success"),
            writeResult("camera+microphone", "error")
        ) :
        navigator.getUserMedia(
          {audio: true, video: true},
          writeResult("camera+microphone", "success"),
          writeResult("camera+microphone", "error")
        );
    },
    "pan-tilt-zoom": function() {
      navigator.mediaDevices ?
        navigator.mediaDevices.getUserMedia(
          {video: {pan: true, tilt: true, zoom: true}}).then(
            writeResult("pan-tilt-zoom", "success"),
            writeResult("pan-tilt-zoom", "error")
        ) :
        navigator.getUserMedia(
          {video: {pan: true, tilt: true, zoom: true}},
          writeResult("pan-tilt-zoom", "success"),
          writeResult("pan-tilt-zoom", "error")
        );
    },
    "pan-tilt-zoom+microphone": function() {
      navigator.mediaDevices ?
        navigator.mediaDevices.getUserMedia(
          {video: {pan: true, tilt: true, zoom: true}, audio: true}).then(
            writeResult("pan-tilt-zoom+microphone", "success"),
            writeResult("pan-tilt-zoom+microphone", "error")
        ) :
        navigator.getUserMedia(
          {video: {pan: true, tilt: true, zoom: true}, audio: true},
          writeResult("pan-tilt-zoom+microphone", "success"),
          writeResult("pan-tilt-zoom+microphone", "error")
        );
    },
    "screenshare": function() {
      navigator.mediaDevices.getDisplayMedia().then(
        writeResult("screenshare", "success"),
        writeResult("screenshare", "error")
      );
    },
    "midi": function() {
      navigator.requestMIDIAccess({
        sysex: true
      }).then(
        writeResult("midi", "success"),
        writeResult("midi", "error")
      );
    },
    "bluetooth": function() {
      if (navigator.bluetooth) {
        navigator.bluetooth.requestDevice({
          // filters: [...] <- Prefer filters to save energy & show relevant devices.
          // acceptAllDevices here ensures dialog can populate, we don't care with what.
          acceptAllDevices:true
        })
        .then(device => device.gatt.connect())
        .then(
          writeResult("bluetooth", "success"),
          writeResult("bluetooth", "error")
        );
      } else {
        writeResult("bluetooth", "error");
      }
    },
    "usb": function() {
      navigator.usb.requestDevice({filters: [{}]}).then(
        writeResult("usb", "success"),
        writeResult("usb", "error")
      );
    },
    "serial": function() {
      if (navigator.serial) {
        navigator.serial.requestPort({filters: []}).then(
          writeResult("serial", "success"),
          writeResult("serial", "error")
        );
      } else {
        writeResult("serial", "error");
      }
    },
    "hid": function() {
      if (navigator.hid) {
        navigator.hid.requestDevice({filters: []}).then(
          devices => {
            // writeResult("hid", devices.length > 0 ? "success" : "error")();
            writeResult("hid", devices.length > 0 ? "success" : "error");
          },
          writeResult("hid", "error")
        );
      } else {
        writeResult("hid", "error");
      }
    },
    "eme": function() {
      // https://w3c.github.io/encrypted-media/#requestMediaKeySystemAccess
      // Tries multiple configuration per key system. The configurations are in
      // descending order of privileges such that a supported permission-requiring
      // configuration should be attempted before a configuration that does not
      // require permissions.

      var knownKeySystems = [
        "com.example.somesystem",  // Ensure no real system is the first tried.
        "com.widevine.alpha",
        "com.microsoft.playready",
        "com.adobe.primetime",
        "com.apple.fps.2_0",
        "com.apple.fps",
        "com.apple.fps.1_0",
        "com.example.somesystem"  // Ensure no real system is the last tried.
      ];
      var tryKeySystem = function(keySystem) {
        // http://w3c.github.io/encrypted-media/#idl-def-mediakeysystemconfiguration
        // One of videoCapabilities or audioCapabilities must be present. Pick
        // a set that all browsers should support at least one of.
        var capabilities = [
          { contentType: 'audio/mp4; codecs="mp4a.40.2"' },
          { contentType: 'audio/webm; codecs="opus"' },
        ];
        navigator.requestMediaKeySystemAccess(
          keySystem,
          [
            { distinctiveIdentifier: "required",
              persistentState: "required",
              audioCapabilities: capabilities,
              label: "'distinctiveIdentifier' and 'persistentState' required"
            },
            { distinctiveIdentifier: "required",
              audioCapabilities: capabilities,
              label: "'distinctiveIdentifier' required"
            },
            { persistentState: "required",
              audioCapabilities: capabilities,
              label: "'persistentState' required"
            },
            { audioCapabilities: capabilities,
              label: "empty"
            },
            { label: "no capabilities" }
          ]
        ).then(
          function (mediaKeySystemAccess) {
            /*
            writeResult("eme", "success")(
              "Key System: " + keySystem,
              "Configuration: " + mediaKeySystemAccess.getConfiguration().label,
              mediaKeySystemAccess);
            */
            writeResult("eme", "success");
          },
          function (error) {
            if (knownKeySystems.length > 0)
              return tryKeySystem(knownKeySystems.shift());

            /*
            writeResult("eme", "error")(
              error,
              error.name == "NotSupportedError" ? "No known key systems supported or permitted." : "");
            */
            writeResult("eme", "error");
          }
        );
      };
      tryKeySystem(knownKeySystems.shift());
    },
    "idle-detection": (function () {
      let controller = null;

      return async function () {
        if (controller) {
          controller.abort();
          controller = null;
          // writeResult("idle-detection", "default")();
          writeResult("idle-detection", "default");
          return;
        }

        try {
          const status = await IdleDetector.requestPermission();
          if (status != "granted") {
            // writeResult("idle-detection", "error")(`Permission status: ${status}`);
            writeResult("idle-detection", "error");
            return;
          }

          controller = new AbortController();
          const detector = new IdleDetector();
          detector.addEventListener('change', () => {
            console.log(`Idle change: ${detector.userState}, ${detector.screenState}.`);
          });
          await detector.start({signal: controller.signal});
          // writeResult("idle-detection", "success")();
          writeResult("idle-detection", "success");
        } catch (e) {
          controller = null;
          // writeResult("idle-detection", "error")(e);
          writeResult("idle-detection", "error");
        }
      };
    }()),
    "copy": (function() {
      var interceptCopy = false;

      document.addEventListener("copy", function(e){
        if (interceptCopy) {
          // From http://www.w3.org/TR/clipboard-apis/#h4_the-copy-action
          e.clipboardData.setData("text/plain",
            "This text was copied from the permission.site clipboard example."
          );
          e.clipboardData.setData("text/html",
            "This text was copied from the " +
            "<a href='https://permission.site/'>" +
            "permission.site</a> clipboard example."
          );
          e.preventDefault();
        }
      });

      return function() {
        interceptCopy = true;
        document.execCommand("copy");
        interceptCopy = false;
      };
    }()),
    "popup": function() {
      var w = window.open(
        location.href,
        "Popup",
        "resizable,scrollbars,status"
      )
      // writeResult("popup", w ? "success" : "error")(w);
      writeResult("popup", w ? "success" : "error");
    },

    "fullscreen": function() {
      // Note: As of 2014-12-16, fullscreen only allows "ask" and "allow" in Chrome.
      document.body.requestFullScreen(
        /* no callback */
      );
    },
    "pointerlock": function() {
      document.body.requestPointerLock(
        /* no callback */
      );
    },
    "download": function() {
      // Two downloads at the same time trigger a permission prompt in Chrome.
      triggerDownload();
      triggerDownload();
    },
    "keygen": function() {
      var keygen = document.createElement("keygen");
      document.getElementById("keygen-container").appendChild(keygen);
    },
    "persistent-storage": function() {
      // https://storage.spec.whatwg.org
      navigator.storage.persist().then(
        function(persisted) {
          // writeResult("persistent-storage", persisted ? "success" : "default")(persisted);
          writeResult("persistent-storage", persisted ? "success" : "default");
        },
        writeResult("persistent-storage", "error")
      )
    },
    "quota-management": function() {
      // https://www.w3.org/TR/2012/WD-quota-api-20120703/
      navigator.webkitPersistentStorage.queryUsageAndQuota(
        function(currentUsageInBytes, currentQuotaInBytes) {
          var quota = currentQuotaInBytes + 1024 * 1024;
          navigator.webkitPersistentStorage.requestQuota(quota,
            function(newQuota) {
              // writeResult("quota-management", (newQuota == quota) ? "success" : "default")(newQuota);
              writeResult("quota-management", (newQuota == quota) ? "success" : "default");
            },
            writeResult("quota-management", "error"));
        },
        writeResult("quota-management", "error")
      )
    },
    "protocol-handler": function() {
      // https://www.w3.org/TR/html5/webappapis.html#navigatorcontentutils
      var url = window.location + '%s';
      try {
        navigator.registerProtocolHandler('web+permissionsite', url, 'title');
      } catch(e) {
        // writeResult("protocol-handler", "error")(e);
        writeResult("protocol-handler", "error");
      }
    },

    "read-text": function() {
      var cb = navigator.clipboard;
      if (cb) {
        cb.readText().then(function(data) {
          writeResult("read-text", "success"); //("Successfully read data from clipboard: '" + data + "'");
        }, function() {
          writeResult("read-text", "error"); //("Failed to read from clipboard");
        });
      } else {
        writeResult("read-text", "error"); //("navigator.clipboard not available");
      }
    },

    "write-text": function() {
      var cb = navigator.clipboard;
      if (cb) {
        navigator.clipboard.writeText("new clipboard data").then(function() {
          writeResult("write-text", "success"); //("Successfully wrote data to clipboard");
        }, function() {
          writeResult("write-text", "error"); //("Failed to write to clipboard");
        });
      } else {
        writeResult("write-text", "error"); //("navigator.clipboard not available");
      }
    },

    "webauthn-attestation": function() {
      // From https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API
      // This code is public domain, per https://developer.mozilla.org/en-US/docs/MDN/About#Copyrights_and_licenses

      // sample arguments for registration
      var createCredentialDefaultArgs = {
          publicKey: {
              // Relying Party (a.k.a. - Service):
              rp: {
                  name: "Acme"
              },

              // User:
              user: {
                  id: new Uint8Array(16),
                  name: "john.p.smith@example.com",
                  displayName: "John P. Smith"
              },

              pubKeyCredParams: [{
                  type: "public-key",
                  alg: -7
              }],

              attestation: "direct",

              timeout: 60000,

              challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                  0x8C, 0x0A, 0x26, 0xFF, 0x22, 0x91, 0xC1, 0xE9, 0xB9, 0x4E, 0x2E, 0x17, 0x1A, 0x98, 0x6A, 0x73,
                  0x71, 0x9D, 0x43, 0x48, 0xD5, 0xA7, 0x6A, 0x15, 0x7E, 0x38, 0x94, 0x52, 0x77, 0x97, 0x0F, 0xEF
              ]).buffer
          }
      };

      // sample arguments for login
      var getCredentialDefaultArgs = {
          publicKey: {
              timeout: 60000,
              // allowCredentials: [newCredential] // see below
              challenge: new Uint8Array([ // must be a cryptographically random number sent from a server
                  0x79, 0x50, 0x68, 0x71, 0xDA, 0xEE, 0xEE, 0xB9, 0x94, 0xC3, 0xC2, 0x15, 0x67, 0x65, 0x26, 0x22,
                  0xE3, 0xF3, 0xAB, 0x3B, 0x78, 0x2E, 0xD5, 0x6F, 0x81, 0x26, 0xE2, 0xA6, 0x01, 0x7D, 0x74, 0x50
              ]).buffer
          },
      };

      // register / create a new credential
      navigator.credentials.create(createCredentialDefaultArgs)
          .then((cred) => {
              console.log("NEW CREDENTIAL", cred);

              // normally the credential IDs available for an account would come from a server
              // but we can just copy them from above...
              var idList = [{
                  id: cred.rawId,
                  transports: ["usb", "nfc", "ble"],
                  type: "public-key"
              }];
              getCredentialDefaultArgs.publicKey.allowCredentials = idList;
              return navigator.credentials.get(getCredentialDefaultArgs);
          })
          .then((assertion) => {
            writeResult("webauthn-attestation", "success"); //(assertion);
          })
          .catch((err) => {
            writeResult("webauthn-attestation", "error"); //(err);
          });
    },
    "nfc": function() {
      if ('NDEFReader' in window) {
        const reader = new NDEFReader();
        reader.scan()
        .then(() => {
          writeResult("nfc", "success"); //("Successfully started NFC scan");
        })
        .catch((err) => {
          writeResult("nfc", "error"); //(err);
        });
      } else {
        writeResult("nfc", "error"); //("NDEFReader is not available");
      }
    },
    "vr": function() {
      if ('xr' in navigator) {
        navigator.xr.requestSession('immersive-vr')
        .then(() => {
          writeResult("vr", "success"); //("Successfully entered VR");
        })
        .catch((err) => {
          writeResult("vr", "error"); //(err);
        });
      } else {
        writeResult("vr", "error"); //("navigator.xr is not available");
      }
    },
    "ar": function() {
      if ('xr' in navigator) {
        navigator.xr.requestSession('immersive-ar')
        .then(() => {
          writeResult("ar", "success"); //("Successfully entered AR");
        })
        .catch((err) => {
          writeResult("ar", "error"); //(err);
        });
      } else {
        writeResult("ar", "error"); //("navigator.xr is not available");
      }
    }
  };

  var sleep = 0;
  for (var type in register) {
    sleep += 100;
    let ele = document.getElementById(type);
    ele.addEventListener('click',
      register[type]
    );
    setTimeout(function(){
      ele.click();
    }, sleep);
  }

  // Sensor tests
  //
  // Vibration API: https://www.w3.org/TR/2016/REC-vibration-20161018/
  try {
    window.navigator.vibrate(100) ? writeResultFn("vibration", "success") : writeResultFn("vibration", "error");
  } catch (err) {
    writeResultFn("vibration", err.message);
  }
  // Orientation
  var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
  orientation ? writeResultFn("orientation", orientation) : writeResultFn("orientation", "error");

  // Accelerometer
  try {
    var acl = new Accelerometer();
    console.log("test");
    if (acl) {
      writeResultFn("accelerometer-x", acl.x);
      writeResultFn("accelerometer-y", acl.y);
      writeResultFn("accelerometer-z", acl.z);
    } else {
      writeResultFn("accelerometer", "error");
    }
  } catch (err) {
    writeResultFn("accelerometer", err.message);
  }

  // Gyroscope
  try {
    var gyro = new Gyroscope();
    if (gyro) {
      writeResultFn("gyroscope-x", gyro.x);
      writeResultFn("gyroscope-y", gyro.y);
      writeResultFn("gyroscope-z", gyro.z);
    } else {
      writeResultFn("gyroscope", "error");
    }
  } catch (err) {
    writeResultFn("gyroscope", err.message);
  }

  // Magnetometer
  try {
    var mag = new Magnetometer();
    if (mag) {
      writeResultFn("magnetometer-x", mag.x);
      writeResultFn("magnetometer-y", mag.y);
      writeResultFn("magnetometer-z", mag.z);
    } else {
      writeResultFn("magnetometer", "error");
    }
  } catch (err) {
    writeResultFn("magnetometer", err.message);
  }

  // Proximity
  try {
    var prox = new ProximitySensor();
    if (mag) {
      writeResultFn("proximity-distance", prox.distance);
      writeResultFn("proximity-max", prox.max);
      writeResultFn("proximity-near", prox.near);
    } else {
      writeResultFn("proximity", "error");
    }
  } catch (err) {
    writeResultFn("proximity", err.message);
  }

  // AmbientLight
  try {
    var ambient = new AmbientLightSensor();
    ambient ? writeResultFn("ambientlight", ambient.illuminance) : writeResultFn("ambientlight", "error");
  } catch (err) {
    writeResultFn("ambientlight", err.message);
  }
  // Battery
  try {
    navigator.getBattery()
    .then(batman => {
      writeResultFn("battery-charging", batman.charging);
      writeResultFn("battery-charging-time", batman.chargingTime);
      writeResultFn("battery-discharging-time", batman.dischargingTime);
      writeResultFn("battery-level", batman.level);
    })
    .catch(err => {
      writeResultFn("battery", err.message);
    });
  } catch (err) {
    writeResultFn("battery", err.message);
  }

  // https://w3c.github.io/permissions/#enumdef-permissionname
  var sensorList = [
    "geolocation",
    "notifications",
    "push",
    "midi",
    "camera",
    "microphone",
    "speaker-selection",
    "device-info",
    "background-fetch",
    "background-sync",
    "bluetooth",
    "persistent-storage",
    "ambient-light-sensor",
    "accelerometer",
    "gyroscope",
    "magnetometer",
    "clipboard-read",
    "clipboard-write",
    "display-capture",
    "nfc"
  ];
  sensorList.forEach((sensor, index) => {
    navigator.permissions.query({ name: sensor })
    .then(result => {
      window.results[`permissions-${sensor}`] = result.state;
    })
    .catch(err => {
      window.results[`permissions-${sensor}`] = err.message;
    });
  });

  setTimeout(function(){
    // Upload the result from this page to mitmproxy
    const req = new XMLHttpRequest();
    req.open('POST', '/permissionsResultUploadRequest', true);
    req.send(JSON.stringify({
      permissionsResult: window.results
    }));
  }, 10000);

});
