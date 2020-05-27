import RS from "./RemoteSync";
import { state } from "../state"
// import PeerJSClient from "./PeerJSClient";
import FirebaseSignalingServer from "./FirebaseSignalingServer";
// import FirebaseClient from "./FirebaseClient"
import WebRTCClient from "./WebRTCClient";

export class SharedExperience
{
    constructor()
    {
        this.remoteSync = new RS.RemoteSync(
            new WebRTCClient(
                new FirebaseSignalingServer({
                    authType: 'none',
                    apiKey: 'AIzaSyBu6M0W3iBAWPLIkW5L3ixr7io2IQZxQOA',
                    authDomain: 'sandcastle-e07df.firebaseapp.com',
                    databaseURL: 'https://sandcastle-e07df.firebaseio.com'
                }),
                // new FirebaseClient({
                //     authType: 'none',
                //     apiKey: "AIzaSyBu6M0W3iBAWPLIkW5L3ixr7io2IQZxQOA",
                //     authDomain: "sandcastle-e07df.firebaseapp.com",
                //     databaseURL: "https://sandcastle-e07df.firebaseio.com",
                //     projectId: "sandcastle-e07df",
                //     storageBucket: "sandcastle-e07df.appspot.com",
                //     messagingSenderId: "759077241408",
                //     appId: "1:759077241408:web:c615b3ff8181fc2a65d5a5",
                //     measurementId: "G-X3VYHXT0XN"
                // }),

            )
        );
        this.remoteSync.addEventListener('open', this.onOpen.bind(this));
        this.remoteSync.addEventListener('close', this.onClose.bind(this));
        this.remoteSync.addEventListener('error', this.onError.bind(this));
        this.remoteSync.addEventListener('connect', this.onConnect.bind(this));
        this.remoteSync.addEventListener('disconnect', this.onDisconnect.bind(this));
        this.remoteSync.addEventListener('receive', this.onReceive.bind(this));
        this.remoteSync.addEventListener('add', this.onAdd.bind(this));
        this.remoteSync.addEventListener('remove', this.onRemove.bind(this));
    }

    onOpen(id)
    {
        this.clientId = id;
        const link = location.protocol + '//' + location.host + location.pathname + "?" + id;
        const a = document.createElement('a');
        a.setAttribute('href', link);
        a.setAttribute('target', '_blank');
        a.innerHTML = link;
        document.querySelector(".info").appendChild(a);
        state.eventHandler.dispatchEvent("peerconnected");
        this.connectFromURL();
    }

    onReceive(data)
    {

    }

    onAdd(destId, objectId, info)
    {
        console.log("onAdd: connected to " + destId);
    }

    onRemove(destId, objectId, object)
    {
        if (object.parent !== null) object.parent.remove(object);
    }


    onClose(destId)
    {
        console.log('Disconnected to ' + destId);
    }

    onError(error)
    {
        console.log(error);
    }

    onConnect(destId)
    {
        console.log('onConnect: Connected with ' + destId);

    }

    onDisconnect(destId, object)
    {
        console.log('Disconnected with ' + destId);
    }

    connect(id)
    {
        if (id === this.clientId)
        {
            console.log(id + ' is your id');
            return;
        }
        console.log('Connecting with ' + id);
        this.remoteSync.connect(id);
    }

    connectFromURL()
    {
        const url = location.href;
        const index = url.indexOf('?');
        if (index >= 0)
        {
            const id = url.slice(index + 1);
            this.connect(id);
        }
    }

    showMessage(str) { console.log(str); }
}
