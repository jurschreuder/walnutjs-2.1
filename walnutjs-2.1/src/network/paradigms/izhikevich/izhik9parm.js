import { Paradigm } from "./../paradigm";
import { NodeVariable } from "./../paradigm";

class Izhi9param extends Paradigm {
 
  // activation rule Izhikevich spiking neuron 9 parameter model
  nodeActivateFunction = (network, neuronIndex) => {
    const i = neuronIndex;
    const ns = network.nodes.neurons;

    //ns.act[i] = ns.net[i] > 0 ? ns.net[i] : 0;
    
    let v = ns.v[i];
    let u = ns.u[i];
    let dt = ns.dt[i];
    let Vr = ns.Vr[i];
    let net = ns.net[i] * 25; // the 9 param version uses pA instead of mV, which is about x15

    let act = 0.0;

    v += dt * (( ns.k[i] * (v - Vr) * (v - ns.Vt[i]) - u + net + ns.I[i]) / ns.C[i]);

    u += dt * ( ns.a[i] * (ns.b[i] * (v-Vr) - u ));

    if( v > ns.Vpeak[i] ){
      act = 1;
      v = ns.Vmin[i];
      u += ns.d[i];
    }
    //console.log(v, u);

    ns.act[i] = act;
    ns.v[i] = v;
    ns.u[i] = u;

  };
  
  // basic activation function tracts,
  // net += act * weight 
  tractActivateFunction = (network, connectionIndex) => {
    const i = connectionIndex;
    const neurons = network.nodes.neurons;
    const conns = network.tracts.connections;

    neurons.net[conns.to[i]] +=  neurons.act[conns.from[i]] * conns.weight[i];
  };

  constructor() {
    super("Izhikevich 9 parameter spiking neuron model");

    // init default values to "Regular Spiking (RS)"
    this.nodeVariables.push( new NodeVariable("a", "float32", 0.03, [-0.1, 0.1]) );
    this.nodeVariables.push( new NodeVariable("b", "float32", -2.0, [ -5, 5]) );
    this.nodeVariables.push( new NodeVariable("d", "float32", 100.0, [0, 200]) );
    this.nodeVariables.push( new NodeVariable("k", "float32", 0.7, [0, 2]) );
    this.nodeVariables.push( new NodeVariable("C", "float32", 100.0, [0, 200]) );
    this.nodeVariables.push( new NodeVariable("Vr", "float32", -60.0, [-150, 0]) );
    this.nodeVariables.push( new NodeVariable("Vt", "float32", -40.0, [-150, 0]) );
    this.nodeVariables.push( new NodeVariable("Vpeak", "float32", 35.0, [-20, 100]) );
    this.nodeVariables.push( new NodeVariable("Vmin", "float32", -50.0, [-150, 0]) );

    // step size ms
    this.nodeVariables.push( new NodeVariable("dt", "float32", 1.0, [0, 1]) );

    // current status neuron
    this.nodeVariables.push( new NodeVariable("v", "float32", -60.0, [-100, 100]) ); // init with Vr
    this.nodeVariables.push( new NodeVariable("u", "float32", -60.0*-2.0, [-100, 300]) ); // init with Vr*b

    this.nodeVariables.push( new NodeVariable("I", "float32", 0.0, [0, 100]) ); // input

  }
}

export { Izhi9param }

