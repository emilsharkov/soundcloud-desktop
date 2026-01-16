# soundcloud-desktop

This is an unofficial desktop client for [Soundcloud](https://soundcloud.com/) written using React and Tauri
![soundcloud-desktop](soundcloud-desktop.png)

## Requirements

You need to have the following installed on your system:

- `rustc/cargo/rustup`

    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

- `npm/node`
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

    nvm install node
    ```

## Get App Set Up

Install dependencies:

- `npm install`

## Run Application Locally

Run the desktop app in dev:

- `npm run tauri dev`

## Bundle into Application

Create a production desktop bundle with Tauri:

- `npm run tauri build`
