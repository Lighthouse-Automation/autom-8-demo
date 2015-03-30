# autom-8-demo
A web app built with the Autom-8 framework to demonstrate real world control.

This is a work in progress

## Installation

```bash
  git clone <this repo> && npm install
``` 
  and 
```bash
  ./bin/www
```
  or
```bash
  DEBUG=* ./bin/www
```

## Usage
  
  Point your browser to [localhost:3000](http://localhost:3000/) for the front page.

  You will nedd to click the link to the embedded node and create a flow and deploy it. Try the one below.

  ```json
  [{"id":"2c89f2e5.d3760e","type":"mqtt-broker","broker":"localhost","port":"1884","clientid":""},{"id":"3aa06742.c55f98","type":"mqtt in","name":"","topic":"/devices/loopback/#","broker":"2c89f2e5.d3760e","x":98,"y":262,"z":"a1e5845a.5e1a78","wires":[["bf55b58d.40aa48"]]},{"id":"12f92332.ed06dd","type":"inject","name":"Turn 1 on","topic":"/devices/loopback/1/newstate","payload":"{\"action\":\"on\"}","payloadType":"string","repeat":"","crontab":"","once":false,"x":111,"y":75,"z":"a1e5845a.5e1a78","wires":[["425ccc1b.bda334","c6846fd3.397b9"]]},{"id":"5a8917c2.a576e8","type":"function","name":"Loopback device control logic","func":"//Initially we will want to save the loopback device states\n//So if we don't have a saved state, initialise it\nif (!context.state) {\n\tcontext.state = {};\n\tcontext.state['1'] = 'off';\n\tcontext.state['2'] = 'off';\n\t}\n\n//first parse out the topic to get an endpoint and device ID\nvar topicElements = msg.topic.split('/');\nvar endpoint = topicElements[topicElements.length - 1];\nvar devId = topicElements[topicElements.length - 2];\n\n//the only endpoint we don't respond to is 'state' as we send this out to publish\nif (endpoint === 'state') {\n\treturn null;\n};\n\n//then construct the new message, the default is to send out the state message\ntopicElements[topicElements.length - 1] = 'state';\nmsg.topic = topicElements.join('/');\nmsg.payload['state'] = context.state[devId];\n\nif (endpoint === 'newstate') {\n\tswitch (msg.payload.action) {\n\t\tcase 'on':\n\t\tcase 'off':\n\t\t\tcontext.state[devId] = msg.payload['state'] = msg.payload.action;\n\t\t\tdelete msg.payload.action;\n\t\t\tbreak;\n\t\tdefault:\n\t\t\tbreak;\n\t\t}\n\t}\nreturn msg;","outputs":1,"x":279,"y":466,"z":"a1e5845a.5e1a78","wires":[["be6317a1.419ce8"]]},{"id":"425ccc1b.bda334","type":"debug","name":"","active":false,"console":"false","complete":"true","x":516,"y":75,"z":"a1e5845a.5e1a78","wires":[]},{"id":"c6846fd3.397b9","type":"mqtt out","name":"","topic":"","qos":"","retain":"","broker":"2c89f2e5.d3760e","x":517,"y":133,"z":"a1e5845a.5e1a78","wires":[]},{"id":"76f900ae.8907","type":"later","name":"","schedule":"","x":206,"y":399,"z":"a1e5845a.5e1a78","wires":[["5a8917c2.a576e8"]]},{"id":"bf55b58d.40aa48","type":"json","name":"","x":173,"y":327,"z":"a1e5845a.5e1a78","wires":[["76f900ae.8907"]]},{"id":"9220009f.6de","type":"inject","name":"Turn 1 off","topic":"/devices/loopback/1/newstate","payload":"{\"action\":\"off\"}","payloadType":"string","repeat":"","crontab":"","once":false,"x":110,"y":133,"z":"a1e5845a.5e1a78","wires":[["425ccc1b.bda334","c6846fd3.397b9"]]},{"id":"be6317a1.419ce8","type":"mqtt out","name":"","topic":"","qos":"","retain":"","broker":"2c89f2e5.d3760e","x":535,"y":466,"z":"a1e5845a.5e1a78","wires":[]},{"id":"8bd4163.f742be8","type":"mqtt in","name":"Watch state messages","topic":"/devices/loopback/+/state","broker":"2c89f2e5.d3760e","x":112,"y":534,"z":"a1e5845a.5e1a78","wires":[["a3978eef.5c687"]]},{"id":"a3978eef.5c687","type":"debug","name":"Loopback dev state","active":true,"console":"false","complete":"payload","x":534,"y":534,"z":"a1e5845a.5e1a78","wires":[]},{"id":"974934e9.68b6c8","type":"comment","name":"Test device 1","info":"The two inject nodes send an on or off message to the topic '/devices/loopback/1/newstate'.","x":78,"y":31,"z":"a1e5845a.5e1a78","wires":[]},{"id":"245f1432.dba0ec","type":"comment","name":"The loopback device control logic","info":"Subscribes to the loopback device topic. The function node stores the current state, a message to the endpoint 'newstate' will change the state. Any other endpoint sends the current state.\n\nIf the endpoint is 'state', no message is sent on as this logic generates the 'state' message.","x":141,"y":206,"z":"a1e5845a.5e1a78","wires":[]}]
  ```
