// default scene loaded in src/engine/engine.js
import {
  Scene,
  AxesHelper,
  SphereBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  AmbientLight,
} from "three";

import PeerConnection from "../engine/networking/PeerConnection";

import Pen from "./penxrpk2";

const scene = new Scene();
const networking = new PeerConnection(scene);

scene.init = () => {
  var axesHelper = new AxesHelper(5);
  scene.add(axesHelper);
  const networking = "";
  const pen = new Pen(scene, networking);
  scene.add(pen);

  scene.add(new AmbientLight(0xffffff, 1));
};

scene.init();

export { scene };