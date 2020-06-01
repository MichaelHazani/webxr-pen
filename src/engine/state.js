//helper class for custom XR events
class Event
{
    constructor(name)
    {
        this.name = name;
        this.callbacks = [];
    }
    registerCallback(callback)
    {
        this.callbacks.push(callback);
    }
}

class EventHandler
{
    constructor()
    {
        this.events = {};
    }

    registerEvent(eventName)
    {
        var event = new Event(eventName);
        this.events[ eventName ] = event;
    };

    dispatchEvent(eventName, eventArgs)
    {
        this.events[ eventName ].callbacks.forEach(function (callback)
        {
            callback(eventArgs);
        });
    };

    addEventListener(eventName, callback)
    {
        this.events[ eventName ].registerCallback(callback);
    };
}

// main state singleton
class StateClass
{
    constructor()
    {
        this.isXRSession = false;
        this.isPaused = false;
        this.currentSession = null;
        this.debugPhysics = true;
        this.eventHandler = new EventHandler();
        this.eventHandler.registerEvent('xrsessionstarted');
        this.eventHandler.registerEvent('xrsessionended');
        this.eventHandler.registerEvent('peerconnected');
        this.eventHandler.registerEvent('peerdisconnected');
        this.bindDebugKeys();
    }

    bindDebugKeys()
    {
        document.addEventListener('keydown', (e) =>
        {
            if (!e.shiftKey) return;

            switch (e.keyCode)
            {
                case 192: // tilde
                    this.debugPhysics = !this.debugPhysics;
                    console.log("Physics Debug: " + this.debugPhysics);
                    break;
                case 80: //"p"
                    this.isPaused = !this.isPaused;
                    console.log("Paused: " + this.isPaused);
                    break;
                default:
                    break;
            }
        });
    }
};

const State = new StateClass();
export default State;