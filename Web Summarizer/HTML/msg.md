--boundary_.oOo._hOyA2FBfnAanvhY9QCOjL7CmrpRvI7bb
Content-Length: 1078
Content-Type: application/octet-stream
If-Match: "40fb118c4bdf7810a168c6d2518435c6"
X-File-MD5: 88b500ac23ef4fad56dd7f4e9a616e5c
X-File-Mtime: 1710284344
X-File-Path: /computerdocs/Brock/CS 4P02/COSC-4P02/Web Summarizer/js/login.js

import {auth, provider} from './firebase-init.js';
import {signInWithPopup} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

const googleLogin=document.getElementById("google-login-btn");
googleLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    })

    
--boundary_.oOo._hOyA2FBfnAanvhY9QCOjL7CmrpRvI7bb
Content-Length: 13158
Content-Type: application/octet-stream
X-File-MD5: 4657cf5cda9b6112ea941e23de26f30f
X-File-Mtime: 1710284345
X-File-Path: /computerdocs/Brock/CS 4P02/COSC-4P02/Web Summarizer/js/node_modules/websocket-extensions/README.md

# websocket-extensions [![Build status](https://secure.travis-ci.org/faye/websocket-extensions-node.svg)](http://travis-ci.org/faye/websocket-extensions-node)

A minimal framework that supports the implementation of WebSocket extensions in
a way that's decoupled from the main protocol. This library aims to allow a
WebSocket extension to be written and used with any protocol library, by
defining abstract representations of frames and messages that allow modules to
co-operate.

`websocket-extensions` provides a container for registering extension plugins,
and provides all the functions required to negotiate which extensions to use
during a session via the `Sec-WebSocket-Extensions` header. By implementing the
APIs defined in this document, an extension may be used by any WebSocket library
based on this framework.

## Installation

```
$ npm install websocket-extensions
```

## Usage

There are two main audiences for this library: authors implementing the
WebSocket protocol, and authors implementing extensions. End users of a
WebSocket library or an extension should be able to use any extension by passing
it as an argument to their chosen protocol library, without needing to know how
either of them work, or how the `websocket-extensions` framework operates.

The library is designed with the aim that any protocol implementation and any
extension can be used together, so long as they support the same abstract
representation of frames and messages.

### Data types

The APIs provided by the framework rely on two data types; extensions will
expect to be given data and to be able to return data in these formats:

#### *Frame*

*Frame* is a structure representing a single WebSocket frame of any type. Frames
are simple objects that must have at least the following properties, which
represent the data encoded in the frame:

| property     | description                                                        |
| ------------ | ------------------------------------------------------------------ |
| `final`      | `true` if the `FIN` bit is set, `false` otherwise                  |
| `rsv1`       | `true` if the `RSV1` bit is set, `false` otherwise                 |
| `rsv2`       | `true` if the `RSV2` bit is set, `false` otherwise                 |
| `rsv3`       | `true` if the `RSV3` bit is set, `false` otherwise                 |
| `opcode`     | the numeric opcode (`0`, `1`, `2`, `8`, `9`, or `10`) of the frame |
| `masked`     | `true` if the `MASK` bit is set, `false` otherwise                 |
| `maskingKey` | a 4-byte `Buffer` if `masked` is `true`, otherwise `null`          |
| `payload`    | a `Buffer` containing the (unmasked) application data              |

#### *Message*

A *Message* represents a complete application message, which can be formed from
text, binary and continuation frames. It has the following properties:

| property | description                                                       |
| -------- | ----------------------------------------------------------------- |
| `rsv1`   | `true` if the first frame of the message has the `RSV1` bit set   |
| `rsv2`   | `true` if the first frame of the message has the `RSV2` bit set   |
| `rsv3`   | `true` if the first frame of the message has the `RSV3` bit set   |
| `opcode` | the numeric opcode (`1` or `2`) of the first frame of the message |
| `data`   | the concatenation of all the frame payloads in the message        |

### For driver authors

A driver author is someone implementing the WebSocket protocol proper, and who
wishes end users to be able to use WebSocket extensions with their library.

At the start of a WebSocket session, on both the client and the server side,
they should begin by creating an extension container and adding whichever
extensions they want to use.

```js
var Extensions = require('websocket-extensions'),
    deflate    = require('permessage-deflate');

var exts = new Extensions();
exts.add(deflate);
```

In the following examples, `exts` refers to this `Extensions` instance.

#### Client sessions

Clients will use the methods `generateOffer()` and `activate(header)`.

As part of the handshake process, the client must send a
`Sec-WebSocket-Extensions` header to advertise that it supports the registered
extensions. This header should be generated using:

```js
request.headers['sec-websocket-extensions'] = exts.generateOffer();
```

This returns a string, for example `"permessage-deflate;
client_max_window_bits"`, that represents all the extensions the client is
offering to use, and their parameters. This string may contain multiple offers
for the same extension.

When the client receives the handshake response from the server, it should pass
the incoming `Sec-WebSocket-Extensions` header in to `exts` to activate the
extensions the server has accepted:

```js
exts.activate(response.headers['sec-websocket-extensions']);
```

If the server has sent any extension responses that the client does not
recognize, or are in conflict with one another for use of RSV bits, or that use
invalid parameters for the named extensions, then `exts.activate()` will
`throw`. In this event, the client driver should fail the connection with
closing code `1010`.

#### Server sessions

Servers will use the method `generateResponse(header)`.

A server session needs to generate a `Sec-WebSocket-Extensions` header to send
in its handshake response:

```js
var clientOffer = request.headers['sec-websocket-extensions'],
    extResponse = exts.generateResponse(clientOffer);

response.headers['sec-websocket-extensions'] = extResponse;
```

Calling `exts.generateResponse(header)` activates those extensions the client
has asked to use, if they are registered, asks each extension for a set of
response parameters, and returns a string containing the response parameters for
all accepted extensions.

#### In both directions

Both clients and servers will use the methods `validFrameRsv(frame)`,
`processIncomingMessage(message)` and `processOutgoingMessage(message)`.

The WebSocket protocol requires that frames do not have any of the `RSV` bits
set unless there is an extension in use that allows otherwise. When processing
an incoming frame, sessions should pass a *Frame* object to:

```js
exts.validFrameRsv(frame)
```

If this method returns `false`, the session should fail the WebSocket connection
with closing code `1002`.

To pass incoming messages through the extension stack, a session should
construct a *Message* object according t
=======