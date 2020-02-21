# Qode

<img alt="logo" src="https://github.com/nodegui/nodegui/raw/master/extras/logo/nodegui.png" height="200" />

Qode is a lightly modified fork of Node.js that allows Node's event loop to be merged with Qt's or any other Gui event loop.
It is designed to be used together with `@nodegui/nodegui`. Qode achieves this by allowing message loop injection via a NodeJS addon.

Qode allows you to run both Qt and Node's event loops in the same thread. This is crucial to achieving low CPU footprint.
Qode can be used as a _drop in_ replacement of NodeJS and hence you could consider it as NodeJS with Qt powers 💪.

This npm module downloads the prebuilt qode for the current Operating System.

_Build Instructions for qode can be found here:_ https://github.com/nodegui/qode

# Installation

```
yarn add @nodegui/qode
```

or

```
npm install @nodegui/qode
```

# Version Table:

| Qode        | Node    | Qt                 |
| ----------- | ------- | ------------------ |
| 2.0.0      | 12.11.0  | depends on Nodegui |
| ----------- | ------- | ------------------ |
