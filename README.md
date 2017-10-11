# Tarchon

A simple Cli to know the state of your dependencies


# Options

--max-delay : abandoned/major/minor/patch
--max-count : (int) The number of dependencies you accept in delay
--require-only
--info-only : Only diplay delay information, not breaking your CI process
--verbose   : display every dependencies information


# Docker

`docker run -tv ${PWD}:/project purplebabar/tarchon`
