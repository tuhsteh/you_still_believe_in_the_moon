# Update Chromedriver

Sometimes, Chrome updates even though i told it not to and it sucks and i hate it and then `chromedriver` and Chrome go through a trial separation and Chrome moves out and then you're lucky if Chrome remembers to send a birthday card every few years.  So i made a tool to update `chromedriver` to the latest version.

## Usage

1. Checkout the project with Git or just download it.  Put it someplace where you can keep track of it (i like `~/code/{ORGANISATION}/{REPO}`).
1. Install NodeJS using Node Version Manager (`nvm`), available on [homebrew](https://homebrew.sh).
1. Use `nvm` to install at least LTS Iron (v20.19.0) or newer.
1. Use Node Package Manager to install dependencies (`npm install` from the source root).
1. Run the "start" script (`npm start` from the source root).

## Bash Command

i use Bash.  Sorry.  If you use ZSH or some other shell, adapt these suggestions for your use.

1. Make sure a personal bin folder is on the PATH (maybe `~/.bash_profile` or `~/.bashrc` or `~/.zshrc`.  i have a `~/bin` location.  You do you.).
2. Make a shell script that runs the Node "Start" script.  An example is provided in `updatechromedriver.sh.example`.

## Where to Install Chromedriver???

That's really up to you.  i put mine in `/usr/local/bin` so that it's available
to all processes that need to run it (like Selenium).  Make sure that the location is in your
`$PATH` so it can be found.

