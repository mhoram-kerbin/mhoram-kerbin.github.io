var assembly_req  = 0.00425 * 2; // The Assembly Plant has double the amount of converters
var modular_prod  = 0.017;
var modular_req   = 0.0085 * 2;
var fabrication_prod  = 0.034;
var fabrication_req   = 0.017 * 2;
var refinery_prod = 0.051;
var refinery_req_biomass = 0.00032452726575;
var refinery_req_extracted = 0.51;
var biolab_prod   = 0.00032452726575;
var biolab_req_water = 0.00062422730898;
var biolab_req_substrate = 0.1275;

var assembly_pC = 0.00085 * 6;
var modular_pC  = 0.00085 * 3;
var fabrication_pC  = 0.00085 * 3;
var refinery_pC = 0.00085 * 3;
var biolab_pC   = 0.00085;
var ccc_pC      = 0.02125;

var ppm_mth_factor = 36;

function onInput (field)
{
    afterChange(field);
}

function toggleInputType (field)
{
//    alert(field.toString());
    var sib = field.previousSibling.previousSibling;
//    alert(field.previousSibling.getAttribute('name'));
    if (field.value == 'mT/h') {
        field.setAttribute('value', 'ppm');
    } else {
        field.setAttribute('value', 'mT/h');
    }
//    alert(sib);
    afterChange(sib);
}

function afterChange (field)
{
//    alert (field.getAttribute('id') + ' has changed');
    var name = field.id;
//    alert(name);

    switch(name) {
    case 'substrate':
        calcFromBelow('refinery', 'substrate');
        calcFromBelow('biolab');
        break;
    case 'minerals':
        calcFromBelow('refinery', 'minerals');
        break;
    case 'ore':
        calcFromBelow('refinery', 'ore');
        break;
    case 'water':
        calcFromBelow('biolab');
        break;
    case 'biolab':
        calcFromBelow('refinery', 'biolab');
        break;
    case 'refinery':
        calcFromBelow('fabrication');
        calcFromAbove('biolab');
        calcFromAbove('minerals');
        calcFromAbove('substrate');
        calcFromAbove('ore');
        break;
    case 'fabrication':
        calcFromBelow('modular');
        calcFromAbove('refinery');
        break;
    case 'modular':
        calcFromBelow('assembly');
        calcFromAbove('fabrication');
        break;
    case 'assembly':
        calcFromAbove('modular');
        break;
    }

    calcCCC();
}

function calcCCC ()
{
    var pC = 0;

    pC += document.getElementById('assembly').value * assembly_pC;
    pC += document.getElementById('modular').value * modular_pC;
    pC += document.getElementById('fabrication').value * fabrication_pC;
    pC += document.getElementById('refinery').value * refinery_pC;
    pC += document.getElementById('biolab').value * biolab_pC;
//    alert(pC / ccc_pC);
    document.getElementById('ccc').setAttribute('value', pC / ccc_pC);
}

function calcFromBelow (targetname, sourcename)
{
    switch (targetname) {

    case 'biolab':
        
        break;

    case 'refinery':
        if (sourcename == 'biolab') {
            var source_eff = document.getElementById('biolab').value;
            var conversion_factor = biolab_prod / refinery_req_biomass;
            var target_eff = source_eff * conversion_factor;
            document.getElementById('refinery').setAttribute('value', target_eff);
        }
        if (sourcename != 'minerals')  { calcFromAbove('minerals'); }
        if (sourcename != 'substrate') { calcFromAbove('substrate', 'both'); }
        if (sourcename != 'ore')       { calcFromAbove('ore'); }
        calcFromBelow('fabrication');
        break;

    case 'fabrication':
        var source_eff = document.getElementById('refinery').value;
        var conversion_factor = refinery_prod / fabrication_req;
        var target_eff = source_eff * conversion_factor;
        document.getElementById('fabrication').setAttribute('value', target_eff);
        calcFromBelow('modular');
        break;

    case 'modular':
        var source_eff = document.getElementById('fabrication').value;
        var conversion_factor = fabrication_prod / modular_req;
        var target_eff = source_eff * conversion_factor;
        document.getElementById('modular').setAttribute('value', target_eff);
        calcFromBelow('assembly');
        break;

    case 'assembly':
        var source_eff = document.getElementById('modular').value;
        var conversion_factor = modular_prod / assembly_req;
        var target_eff = source_eff * conversion_factor;
        document.getElementById('assembly').setAttribute('value', target_eff);
        break;
    }
}

function calcFromAbove (targetname, sourcename)
{
    switch (targetname) {
    case 'substrate':
        
        break;

    case 'minerals':
        
        break;

    case 'ore':
        
        break;

    case 'water':
        var unitfactor;
        if (document.getElementById('water').nextSibling.nextSibling.value == 'mT/h') {
            unitfactor = 1;
        } else {
            unitfactor = ppm_mth_factor;
        }
        alert (unitfactor);
//        var source_eff = document.getElementById('biolab').value;
//        var conversion_factor = biolab_req_water / biolab_prod;
//        var target_eff = source_eff * conversion_factor;
//        document.getElementById('biolab').setAttribute('value', target_eff);
        break;

    case 'biolab':
        var source_eff = document.getElementById('refinery').value;
        var conversion_factor = refinery_req_biomass / biolab_prod;
        var target_eff = source_eff * conversion_factor;
        document.getElementById('biolab').setAttribute('value', target_eff);
        calcFromAbove('water');
        break;

    case 'refinery':
        var source_eff = document.getElementById('fabrication').value;
        var conversion_factor = fabrication_req / refinery_prod;
        var target_eff = source_eff * conversion_factor;
        document.getElementById('refinery').setAttribute('value', target_eff);
        calcFromAbove('biolab');
        calcFromAbove('substrate', 'both');
        calcFromAbove('minerals');
        calcFromAbove('ore');
        break;

    case 'fabrication':
        var source_eff = document.getElementById('modular').value;
        var conversion_factor = modular_req / fabrication_prod;
        var target_eff = source_eff * conversion_factor;
        document.getElementById('fabrication').setAttribute('value', target_eff);
        calcFromAbove('refinery');
        break;

    case 'modular':
//        alert("in modular from above");
        var source_eff = document.getElementById('assembly').value;
//        console.log("assembly eff:" + assembly_eff);
        var conversion_factor = assembly_req / modular_prod;
        var target_eff = source_eff * conversion_factor;
        document.getElementById('modular').setAttribute('value', target_eff);
        calcFromAbove('fabrication');
        break;
    }

}
