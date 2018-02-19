# ARETHA

A simple Cli to know your project status and R.E.S.P.E.C.T. your dependencies


![](https://raw.githubusercontent.com/PurpleBabar/aretha/master/assets/aretha.png | height=350)
## Options

- --max-delay :     Choose which type of delay may stop the CLI (abandoned/major/minor/patch)
- --max-count :     (int) The number of dependencies you accept in your delay
- --require-only :  allow you to work only with the limits of your requirements (will respect version you set in json files)
- --info-only :     Only diplay delay information, not breaking your CI process
- --verbose   :     Display every dependencies information

You can also use a [.aretha.yml](https://github.com/PurpleBabar/aretha/blob/master/.aretha.yml) file like the one provided in this repository to store your configuration.


## Docker

```docker run -tv ${PWD}:/project purplebabar/aretha --info-only```
