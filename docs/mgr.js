/* jshint esversion: 6 */

define(['managerAPI', 'https://cdn.jsdelivr.net/gh/minnojs/minno-datapipe@0.*/datapipe.min.js'], function(Manager) {

	var API = new Manager();
	
	API.addSettings('skip', true);
	API.setName('mgr');

    init_data_pipe(API, 'DATAPIPEEXPERIMENTID', 'csv'); 

    var global = API.getGlobal();	

    // get the session_id of the redirect study
    //The study is launched from Project Implicit using a link that saves project implicit's session-id
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    var oldsid = getParameterByName('oldsid'); 

    // the study variables    
    var commit = API.shuffle(['commit','no-commit'])[0];//Randomly assign participants to a commit page vs. no commit page
    var socialgroup = API.shuffle(['race','age','gender'])[0]; //the social group
    var task = API.shuffle(['iat','ept'])[0]; //the automatic measure
    var white = API.shuffle(['white_a','white_b','white_c','white_d','white_e']);
    var black = API.shuffle(['black_a','black_b','black_c','black_d','black_e']);
    var young = API.shuffle(['young_a','young_b','young_c','young_d','young_e','young_f','young_g']); 
    var old = API.shuffle(['old_a','old_b','old_c','old_d','old_f','old_e','old_g']); 
    var male = API.shuffle(['m_a','m_b','m_c','m_d','m_e','m_f','m_g']);
    var female = API.shuffle(['f_a','f_b','f_c','f_d','f_e','f_f','f_g']);    
    var wtarget = white[0]; // the white target face identity
    var btarget = black[0]; // the black target face identity
    var ytarget = young[0]; // the young target face identity
    var otarget = old[0]; // the old target face identity
    var mtarget = male[0]; // the male target face identity
    var ftarget = female[0]; // the target female face identity    
    // behaviors-rate condition (how many positive behaviors for the dom target and the nondom target)
    var bvrate = API.shuffle(['d18n0','d17n1','d16n2','d15n3','d14n4','d13n5','d12n6','d11n7','d10n8','d9n9','d8n10','d7n11','d6n12','d5n13','d4n14','d3n15','d2n16','d1n17','d0n18'])[0]; 
    var targetPresOrder = API.shuffle(['domfirst','nondomfirst'])[0]; // for the learning task
    //var orderIE = API.shuffle(['IE','EI'])[0]; // implicit - explicit order // I'm not using this because it conflicts with the measures order
    // The presentation order of the targets’ evaluation, targets’ behaviors evaluation, and group evaluation, 
    // would vary between participants, excluding targets’ evaluation before the induction (8 possible orders [x 4 implicit-explicit orders])
   var measuresOrder = API.shuffle([
        "behavior, induction, group, targets",
        "behavior, induction, targets, group",
        "induction, behavior, group, targets",
        "induction, behavior, targets, group",
        "induction, group, behavior, targets",
        "induction, targets, behavior, group",
        "induction, group, targets, behavior",
        "induction, targets, group, behavior"])[0];      
    
    var introText = "We thank you for being here!</br>"+ 
        "In this study, you will complete three tasks and answer some questions.</br>"+
        "This study should take about <%=global.mins%> minutes to complete. "+
        "At the end, you will receive your results along with information about what it means.<br/>";

    var rateFirstText = "Before you start the main tasks of the study, we would like you to read a few behavior descriptions and rate how positive or negative you feel about each behavior.<br/>";

    //the experiment's dom and nondom targets, and dom and nondom group exemplars (for the indirect measures)
    var domtarget, nondomtarget, domgroup1, domgroup2, domgroup3, domgroup4, nondomgroup1, nondomgroup2, nondomgroup3, nondomgroup4;
    
   if (socialgroup == 'race')
    {
        domtarget = wtarget;
        nondomtarget = btarget;
        domgroup1 = white[1];
        domgroup2 = white[2];
        domgroup3 = white[3];
        domgroup4 = white[4];
        nondomgroup1 = black[1];
        nondomgroup2 = black[2];
        nondomgroup3 = black[3];
        nondomgroup4 = black[4];        
    }
    else if (socialgroup == 'age')
    {
        domtarget = ytarget;
        nondomtarget = otarget;
        domgroup1 = young[1];
        domgroup2 = young[2];
        domgroup3 = young[3];
        domgroup4 = young[4];
        nondomgroup1 = old[1];
        nondomgroup2 = old[2];
        nondomgroup3 = old[3];
        nondomgroup4 = old[4];         
    }    
    else if (socialgroup == 'gender')
    {
        domtarget = mtarget;
        nondomtarget = ftarget;
        domgroup1 = male[1];
        domgroup2 = male[2];
        domgroup3 = male[3];
        domgroup4 = male[4];
        nondomgroup1 = female[1];
        nondomgroup2 = female[2];
        nondomgroup3 = female[3];
        nondomgroup4 = female[4];         
    } 
    
    // text for IAT / EPT
	var domcatname, nondomcatname, domtarname, nondomtarname, domtarcat, nondomtarcat; 
	if (socialgroup == 'race') {
	 domtarname = "the White person";
	 nondomtarname = "the Black person";
	 domtarcat = "a White person";
	 nondomtarcat = "a Black person";
	 domcatname = "White people";
	 nondomcatname = "Black people";	 
	}
	else if (socialgroup == 'age') {
	 domtarname = "the young person";
	 nondomtarname = "the old person";	
	 domtarcat = "a young person";
	 nondomtarcat = "an old person";	 
	 domcatname = "Young people";
	 nondomcatname = "Old people";	 
	}
	else if (socialgroup == 'gender') {
	 domtarname = "the man";
	 nondomtarname = "the woman";
	 domtarcat = "a man";
	 nondomtarcat = "a woman";	 
	 domcatname = "Men";
	 nondomcatname = "Women";	 
	}
	
	// text for groupdel
    var domcat;
    var nondomcat; 
    if (socialgroup == 'race') {
        domcat = 'White person';
        nondomcat = 'Black person';         
    }
    else if (socialgroup == 'age') {
        domcat = 'young person';
        nondomcat = 'old person';          
    }
    else if (socialgroup == 'gender') {
        domcat = 'man';
        nondomcat = 'woman';          
    }    

    // save variables to global
    API.addGlobal({
        mediaURL: './images/',//'/implicit/user/mayanna/raceform2/images/',
        mins : '15', //Duration of your study, in minutes.
        commit:commit,
        //orderIE: orderIE,
        measuresOrder:measuresOrder,
        socialgroup:socialgroup,
        domtarget:domtarget,
        nondomtarget:nondomtarget,
        domgroup1:domgroup1,
        domgroup2:domgroup2,
        domgroup3:domgroup3,
        domgroup4:domgroup4,
        nondomgroup1:nondomgroup1,
        nondomgroup2:nondomgroup2,
        nondomgroup3:nondomgroup3,
        nondomgroup4:nondomgroup4,
        domcatname:domcatname,
        nondomcatname:nondomcatname,
        domtarname:domtarname,
        nondomtarname:nondomtarname, 
        domtarcat:domtarcat,
        nondomtarcat:nondomtarcat,
        domcat:domcat,
        nondomcat:nondomcat,
        task:task,
        bvrate:bvrate,
        targetPresOrder:targetPresOrder,
        introText:introText,
        rateFirstText:rateFirstText
    });
    
// DEFINE BEHAVIORS SET
    var posB = API.shuffle([
			{word: 'Sheltered a family that had lost their home in a fire', alias:'pos1'}, 
            {word: 'Brought a blanket and a hot meal to a homeless person', alias:'pos2'},
            {word: 'Volunteers to visit terminally ill children in the hospital twice a month', alias:'pos3'},
            {word: "Pays college tuition for his sister's children", alias:'pos4'},
            {word: 'Took care of the neighbor’s pets while they were gone', alias:'pos5'},
            {word: 'Collected toys for underprivileged children', alias:'pos6'},
            {word: 'Helped his friend plant a large vegetable garden in the backyard', alias:'pos7'},
            {word: 'Mailed back an expensive item that was delivered to him by mistake', alias:'pos8'},
            {word: 'Cooked a nice dinner for his friends', alias:'pos9'},
            {word: "Always promptly returns what he has borrowed", alias:'pos10'},
            {word: 'Fixed the door knob for his neighbor', alias:'pos11'},
            {word: 'Always makes people laugh when he notices that they are sad', alias:'pos12'},
            {word: 'Became a volunteer basketball coach for a children’s home', alias:'pos13'},
            {word: 'Threw a surprise party for a friend', alias:'pos14'},
            {word: 'Picked up a friend from work late at night', alias:'pos15'},
            {word: 'Bought all of his friends a drink at the bar', alias:'pos16'},
            {word: 'Usually smiles at people he passes on the sidewalk', alias:'pos17'},
            {word: 'Gave directions to a driver who was lost', alias:'pos18'},
            {word: 'Helped a friend repaint his apartment', alias:'pos19'},
            {word: 'Helped a lost child find his way home', alias:'pos20'},
            {word: 'Complimented a friend on his new clothes', alias:'pos21'},
            {word: 'Volunteered to work at the day care center', alias:'pos22'},
            {word: "Repaired a child's bicycle over the weekend", alias:'pos23'}
	]);
	var negB = API.shuffle([
			{word: 'Did not offer his guest anything to drink', alias:'neg1'},
			{word: 'Embarrassed a friend by playing a prank on him', alias:'neg2'}, 
			{word: 'Whispered during a movie even though he knew it disturbed others', alias:'neg3'},
			{word: 'Asked for spare change from a couple even though he had money', alias:'neg4'},
			{word: 'Almost crowded someone off the sidewalk in his hurry to cross the street', alias:'neg5'}, 
			{word: 'Broke into a locker and stole $400 worth of equipment', alias:'neg6'}, 
			{word: 'Cheated in a game of cards', alias:'neg7'}, 
			{word: 'Criticized his friend harshly', alias:'neg8'}, 
			{word: 'Got drunk and insulted everybody at a party', alias:'neg9'}, 
			{word: 'Had his driver’s license suspended for drunken driving', alias:'neg10'}, 
			{word: 'Cut in front of some people in line to buy tickets', alias:'neg11'}, 
			{word: 'Became upset and broke some dishes', alias:'neg12'}, 
			{word: 'Shoplifted an inexpensive item from a store', alias:'neg13'}, 
			{word: "Criticized others because they weren't wearing fashionable clothes", alias:'neg14'}, 
			{word: "Dented the fender of a parked car and didn't leave his name", alias:'neg15'}, 
			{word: 'Fell asleep at the wheel and crashed into an oncoming car', alias:'neg16'}, 
			{word: 'Was arrested for selling heroin to a teenager', alias:'neg17'}, 
			{word: 'Drove through a red light at a potentially dangerous intersection', alias:'neg18'}, 
			{word: 'Threw a rock at a dog that was barking', alias:'neg19'}, 
			{word: 'Smoked on a crowded bus', alias:'neg20'}, 
			{word: 'Made fun of a colleague who has a speech impediment', alias:'neg21'}, 
			{word: 'Stole money and jewelry from his relatives', alias:'neg22'}, 
			{word: 'Hit a dog in the street and drove away without stopping to notify the owner', alias:'neg23'}
    ]);

// ASSIGN BEHAVIORS TO THE TARGETS
    var dombvs, nondombvs;

    if (bvrate == 'd18n0')
    {
        dombvs = posB.slice(0,18); // 18 pos
        nondombvs = negB.slice(0,18); // 18 neg
    }
    else if (bvrate == 'd0n18')
    {
        nondombvs = posB.slice(0,18);
        dombvs = negB.slice(0,18);
    }  
    else if (bvrate == 'd17n1')
    {
        nondombvs = posB.slice(0,1).concat(negB.slice(0,17));
        dombvs = negB.slice(17,18).concat(posB.slice(1,18));
    }      
    else if (bvrate == 'd16n2')
    {
        nondombvs = posB.slice(0,2).concat(negB.slice(0,16));
        dombvs = negB.slice(16,18).concat(posB.slice(2,18));
    } 
    else if (bvrate == 'd15n3')
    {
        nondombvs = posB.slice(0,3).concat(negB.slice(0,15));
        dombvs = negB.slice(15,18).concat(posB.slice(3,18));
    } 
    else if (bvrate == 'd14n4')
    {
        nondombvs = posB.slice(0,4).concat(negB.slice(0,14));
        dombvs = negB.slice(14,18).concat(posB.slice(4,18));
    } 
    else if (bvrate == 'd13n5')
    {
        nondombvs = posB.slice(0,5).concat(negB.slice(0,13));
        dombvs = negB.slice(13,18).concat(posB.slice(5,18));
    } 
    else if (bvrate == 'd12n6')
    {
        nondombvs = posB.slice(0,6).concat(negB.slice(0,12));
        dombvs = negB.slice(12,18).concat(posB.slice(6,18));
    } 
    else if (bvrate == 'd11n7')
    {
        nondombvs = posB.slice(0,7).concat(negB.slice(0,11));
        dombvs = negB.slice(11,18).concat(posB.slice(7,18));
    } 
    else if (bvrate == 'd10n8')
    {
        nondombvs = posB.slice(0,8).concat(negB.slice(0,10));
        dombvs = negB.slice(10,18).concat(posB.slice(8,18));
    } 
    else if (bvrate == 'd9n9')
    {
        nondombvs = posB.slice(0,9).concat(negB.slice(0,9));
        dombvs = negB.slice(9,18).concat(posB.slice(9,18));
    } 
    else if (bvrate == 'd8n10')
    {
        nondombvs = posB.slice(0,10).concat(negB.slice(0,8));
        dombvs = negB.slice(8,18).concat(posB.slice(10,18));
    } 
    else if (bvrate == 'd7n11')
    {
        nondombvs = posB.slice(0,11).concat(negB.slice(0,7));
        dombvs = negB.slice(7,18).concat(posB.slice(11,18));
    } 
    else if (bvrate == 'd6n12')
    {
        nondombvs = posB.slice(0,12).concat(negB.slice(0,6));
        dombvs = negB.slice(6,18).concat(posB.slice(12,18));
    } 
    else if (bvrate == 'd5n13')
    {
        nondombvs = posB.slice(0,13).concat(negB.slice(0,5));
        dombvs = negB.slice(5,18).concat(posB.slice(13,18));
    } 
    else if (bvrate == 'd4n14')
    {
        nondombvs = posB.slice(0,14).concat(negB.slice(0,4));
        dombvs = negB.slice(4,18).concat(posB.slice(14,18));
    } 
    else if (bvrate == 'd3n15')
    {
        nondombvs = posB.slice(0,15).concat(negB.slice(0,3));
        dombvs = negB.slice(3,18).concat(posB.slice(15,18));
    } 
    else if (bvrate == 'd2n16')
    {
        nondombvs = posB.slice(0,16).concat(negB.slice(0,2));
        dombvs = negB.slice(2,18).concat(posB.slice(16,18));
    } 
    else if (bvrate == 'd1n17')
    {
        nondombvs = posB.slice(0,17).concat(negB.slice(0,1));
        dombvs = negB.slice(1,18).concat(posB.slice(17,18));
    } 

    // change male reference for female targets
    if (socialgroup == "gender") {
        nondombvs.forEach((item) => {
                item.word = item.word.replace(/\bhis\b/gi,'her');
                item.word = item.word.replace(/\bhim\b/gi,'her');
                item.word = item.word.replace(/\bhe\b/gi,'she');
        });
    }    
    
    API.addGlobal({
        dombvs:dombvs,
        nondombvs:nondombvs
    });    

// for data saving  

    var dombvArr = []; var nondombvArr = [];
    
    for (var bvnum = 0; bvnum < 18; bvnum++) {
        dombvArr.push(dombvs[bvnum].alias);
        nondombvArr.push(nondombvs[bvnum].alias);
    }

    API.addGlobal({
        dombvArr:dombvArr,
        nondombvArr:nondombvArr
    });  
    
  // add variables to params, for data saving  
    var params = {
        measuresOrder:global.measuresOrder, 
        socialgroup:global.socialgroup, 
        task:global.task, 
        domtarget:global.domtarget, 
        nondomtarget: global.nondomtarget,
        bvrate: global.bvrate,      
        commit:global.commit,
        dombvArr:global.dombvArr,
        nondombvArr:global.nondombvArr,
        targetPresOrder:global.targetPresOrder
    };
    params.oldsid = oldsid;
    API.addGlobal({taskparams:params});    
    
    // preload images
	var imagesArray = []; var imNum;
	
    	for (imNum = 1; imNum < 5; imNum++) {
    	    imagesArray.push(global.mediaURL + domtarget + '_' + imNum + '.jpg'); 
    	    imagesArray.push(global.mediaURL + nondomtarget + '_' + imNum + '.jpg'); 
    }
	    imagesArray.push(global.mediaURL + domgroup1 + '_1.jpg'); 
	    imagesArray.push(global.mediaURL + domgroup2 + '_1.jpg'); 
	    imagesArray.push(global.mediaURL + domgroup3 + '_1.jpg'); 
	    imagesArray.push(global.mediaURL + domgroup4 + '_1.jpg'); 
	    imagesArray.push(global.mediaURL + nondomgroup1 + '_1.jpg'); 
	    imagesArray.push(global.mediaURL + nondomgroup2 + '_1.jpg'); 
	    imagesArray.push(global.mediaURL + nondomgroup3 + '_1.jpg'); 
	    imagesArray.push(global.mediaURL + nondomgroup4 + '_1.jpg');     	    
        imagesArray.push(global.mediaURL + domtarget + '_1_s.jpg');
        imagesArray.push(global.mediaURL + nondomtarget + '_1_s.jpg');    
    
    imagesArray.push(global.mediaURL + 'iat.jpg');

    API.addSettings('preloadImages', imagesArray);


	API.addTasksSet(
	{
    //intro
	instructions: [{type:'message', buttonText:'Continue', piTemplate:true}], 	  
    intro: [{inherit: 'instructions', name: 'realstart', templateUrl: 'intro.jst', title: 'Welcome', piTemplate: true, header: 'Welcome'}],
    commit: [{type: 'quest', name: 'realstart', scriptUrl: 'commit.js', title: 'Welcome', piTemplate: true, header: 'Welcome'}],  
    redirectpage: [{ type: 'message', name: 'redirectpage', templateUrl: 'redirectpage.jst', piTemplate: true, buttonText: '<b>Continue</b>'}],
    consent: [{type: 'quest', name: 'consent', scriptUrl: 'consent.js', header: 'Consent', title: 'Consent Agreement'}],
    redirect: [{ type:'redirect', url: 'https://implicit.harvard.edu/implicit/Assign' }], //this redirects participants back into the pool.
    //induction
	prelrn:	[{inherit:'instructions', name:'prelrn', templateUrl: 'prelrn.jst', title:'Introduction with the individuals',piTemplate: true, header:'Welcome'}],
	instlrn: [{inherit:'instructions', name:'instlrn', templateUrl: 'instlrn.jst', title:'Introduction with the individuals',piTemplate: true, header:'Welcome'}],		
	lrn: [{type: 'time', name: 'lrn', scriptUrl: 'lrn.js'}],   
    //measures - del
	instrate: [{inherit:'instructions', name:'instrate', templateUrl: 'instrate.jst', title:'Questionnaire',piTemplate:true, header:'Questionnaire'}],
	ratebv: [{type: 'quest', piTemplate: true, name: 'ratebv', scriptUrl: 'ratebv.js' }],		
	instdel: [{inherit:'instructions', name:'instdel', templateUrl: 'instdel.jst', title:'Questionnaire',piTemplate:true, header:'Questionnaire'}],
	del: [{type: 'quest', piTemplate: true, name: 'del', scriptUrl: 'del.js'}],
	instgroupdel: [{inherit:'instructions', name:'instgroupdel', templateUrl: 'instgroupdel.jst', title:'Questionnaire',piTemplate:true, header:'Questionnaire'}],
	groupdel: [{type: 'quest', piTemplate: true, name: 'groupdel', scriptUrl: 'groupdel.js'}],	
    //measures - automatic
	instiat: [{inherit:'instructions', name:'instiat', templateUrl: 'instiat.jst', title:'The Sorting Task', header:"The Sorting Task"}],
    iat: [{type: 'time', name: 'iat',scriptUrl: 'iat.js'}],
	instgroupiat: [{inherit:'instructions', name:'instgroupiat', templateUrl: 'instgroupiat.jst', title:'The Sorting Task', header:"The Sorting Task"}],
    groupiat: [{type: 'time', name: 'groupiat',scriptUrl: 'groupiat.js'}],    
	instep: [{inherit:'instructions', name:'instep', templateUrl: 'instep.jst', title:'The Categorization Task', header:"The Categorization Task"}],
    ep: [{type: 'time', name: 'ep',scriptUrl: 'ep.js'}],        
    //end (debrief)
	debriefing: [{
    type:'message', templateUrl: 'debriefing.jst', piTemplate:'debrief', last:true, 
    name:'lastpage',
    load: function(){
        var a = document.querySelectorAll('a');
        a = [].filter.call(a, function(a){ return /Assign$/.test(a);});
        a[0].href = 'https://implicit.harvard.edu/implicit/Assign';
    }
}]
	});


	API.addSequence([
        {
            type: 'post',
            name: 'params',
            data: params
        },
        {inherit: 'consent'},
        {
            mixer: 'branch',// if participants choose "I decline", they are taken to a transition page telling them they are being redirected
            conditions: [
                function(){ return piGlobal.consent.questions.userconsent.response === false;} 
            ],
            data: [
                {inherit: 'redirectpage'},
                {inherit: 'redirect'}
            ]
        },
        {
            mixer: 'branch',
            conditions : [{compare: 'global.commit', to: 'commit'}],
            data: [{inherit:'commit'}],
            elseData: [{inherit:'intro'}]
        },
        {
          mixer: 'multiBranch',
        // 1 "behavior, induction, group, targets", 
        // 2 "behavior, induction, targets, group", 
        // 3 "induction, behavior, group, targets", 
        // 4 "induction, behavior, targets, group", 
        // 5 "induction, group, behavior, targets", 
        // 6 "induction, targets, behavior, group", 
        // 7 "induction, group, targets, behavior", 
        // 8 "induction, targets, group, behavior"          
          branches: [
                      {
                        conditions: [ // m-o 1
                          {compare: 'global.measuresOrder', to: 'behavior, induction, group, targets'}
                        ], 
                        data: [
                                {
                    			    mixer: 'branch',
                                    conditions: [
                                        {compare: 'global.task', to: 'iat'}    
                                        ],
                                    data: [ 
                                            {
                                                mixer: 'choose',
                                                n:1,
                                                data: [
                                                        {
                                                            mixer: 'wrapper', //bvrate,lrn,delgroup,del,iatgroup,iat
                                                            data: [
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'}                                                                
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //bvrate,lrn,iatgroup,iat,delgroup,del
                                                            data: [
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                                                    
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},                                                                    
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'}
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //bvrate,lrn,delgroup,iat,iatgroup,del
                                                            data: [
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},                                                                      
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                                                    
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'}
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //bvrate,lrn,iatgroup,del,delgroup,iat
                                                            data: [
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                                                    
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},                                                                    
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'}                                                                
                                                                ]
                                                        }                                                        
                                                    ] 
                                            } // close choose mixer 
                                    ],
                                    elseData: [ // ep
                                                {
                                                    mixer: 'choose',
                                                    n:1,
                                                    data: [
                                                            {
                                                                mixer: 'wrapper', //bvrate,lrn,delgroup,del,ep
                                                                data: [
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'}, 
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'}                                            
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //bvrate,lrn,ep,delgroup,del
                                                                data: [
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'}, 
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},                                                                        
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //bvrate,lrn,delgroup,ep,del
                                                                data: [
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'}, 
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},                                                                         
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //bvrate,lrn,ep,del,delgroup
                                                                data: [
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'}, 
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},        
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},                                                                        
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}
                                                                    ]
                                                            }                                                            
                                                    ]
                                                } //close choose mixer        
                                            ] //close else
                                } // close iat/ep branch                           
                            ] //close first measure order
                        },
                      {
                        conditions: [ // m-o 2
                          {compare: 'global.measuresOrder', to: 'behavior, induction, targets, group'}
                        ], 
                        data: [
                                {
                    			    mixer: 'branch',
                                    conditions: [
                                        {compare: 'global.task', to: 'iat'}    
                                        ],
                                    data: [ 
                                            { 
                                                mixer: 'choose',
                                                n:1,
                                                data: [
                                                        {
                                                            mixer: 'wrapper', //bvrate,lrn,del,delgroup,iat,iatgroup
                                                            data: [
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},      
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}                                              
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //bvrate,lrn,iat,iatgroup,del,delgroup
                                                            data: [
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},    
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                                                     
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // bvrate,lrn,del,iatgroup,iat,delgroup
                                                            data: [
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},      
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                                                      
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},                                                                    
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // bvrate,lrn,iat,delgroup,del,iatgroup
                                                            data: [
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},     
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},                                                                    
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},                                                                    
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}                                              
                                                                ]
                                                        }                                                        
                                                    ] 
                                            } // close choose mixer
                                        ],
                                    elseData: [ // ep
                                        {
                                            mixer: 'choose',
                                            n:1,
                                            data: [
                                                    {
                                                        mixer: 'wrapper', // bvrate,lrn,del,delgroup,ep
                                                        data: [
                                                                {inherit:'instrate'},
                                                                {inherit:'ratebv'},
                                                                {inherit:'prelrn'},
                                                                {inherit:'instlrn'},
                                                                {inherit:'lrn'},                               
                                                                {inherit:'instdel'},
                                                                {inherit:'del'},  
                                                                {inherit:'instgroupdel'},
                                                                {inherit:'groupdel'},
                                                                {inherit:'instep'},
                                                                {inherit:'ep'}                                            
                                                            ]
                                                    },  
                                                    {
                                                        mixer: 'wrapper', // bvrate,lrn,ep,del,delgroup
                                                        data: [
                                                                {inherit:'instrate'},
                                                                {inherit:'ratebv'},
                                                                {inherit:'prelrn'},
                                                                {inherit:'instlrn'},
                                                                {inherit:'lrn'},                                                            
                                                                {inherit:'instep'},
                                                                {inherit:'ep'},
                                                                {inherit:'instdel'},
                                                                {inherit:'del'},  
                                                                {inherit:'instgroupdel'},
                                                                {inherit:'groupdel'}                                                                
                                                            ]
                                                    },  
                                                    {
                                                        mixer: 'wrapper', // bvrate,lrn,del,ep,delgroup
                                                        data: [
                                                                {inherit:'instrate'},
                                                                {inherit:'ratebv'},
                                                                {inherit:'prelrn'},
                                                                {inherit:'instlrn'},
                                                                {inherit:'lrn'},                               
                                                                {inherit:'instdel'},
                                                                {inherit:'del'},              
                                                                {inherit:'instep'},
                                                                {inherit:'ep'},
                                                                {inherit:'instgroupdel'},
                                                                {inherit:'groupdel'}                                                                
                                                            ]
                                                    },  
                                                    {
                                                        mixer: 'wrapper', // bvrate,lrn,ep,delgroup,del
                                                        data: [
                                                                {inherit:'instrate'},
                                                                {inherit:'ratebv'},
                                                                {inherit:'prelrn'},
                                                                {inherit:'instlrn'},
                                                                {inherit:'lrn'},                                                            
                                                                {inherit:'instep'},
                                                                {inherit:'ep'},
                                                                {inherit:'instgroupdel'},
                                                                {inherit:'groupdel'},
                                                                {inherit:'instdel'},
                                                                {inherit:'del'}                                                                
                                                            ]
                                                    }                                                    
                                                ]
                                        }
                                    ] // close else
                                } // close iat/ep branch                           
                            ] // close 2nd measure order
                        },
                      {
                        conditions: [ // m-o 3
                          {compare: 'global.measuresOrder', to: 'induction, behavior, group, targets'}
                        ], 
                        data: [
                                {
                    			    mixer: 'branch',
                                    conditions: [
                                        {compare: 'global.task', to: 'iat'}    
                                        ],
                                    data: [ 
                                            {
                                                mixer: 'choose',
                                                n:1,
                                                data: [
                                                        {
                                                            mixer: 'wrapper', // lrn,bvrate,delgroup,del,iatgroup,iat
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                           
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'}                                            
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // lrn,bvrate,iatgroup,iat,delgroup,del
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                           
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'}                                                                    
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // lrn,bvrate,delgroup,iat,iatgroup,del
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},     
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'}                                                                      
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // lrn,bvrate,iatgroup,del,delgroup,iat
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'}                                                                    
                                                                ]
                                                        }
                                                    ]
                                            }
                                        ],
                                    elseData: [ // ep
                                                { 
                                                    mixer: 'choose',
                                                    n:1,
                                                    data: [
                                                            {
                                                                mixer: 'wrapper', //lrn,bvrate,delgroup,del,ep
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},   
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'}                                            
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn,bvrate,ep,delgroup,del
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},  
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}                                                                        
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', // lrn,bvrate,delgroup,ep,del
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}                                                                        
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', // lrn,bvrate,ep,del,delgroup
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}                                                                        
                                                                    ]
                                                            }                                                            
                                                        ]
                                                } // close choose mixer
                                        ]
                                } // close iat/ep branch                           
                            ] // close 3rd measure order
                        },
                      {
                        conditions: [ // m-o 4
                          {compare: 'global.measuresOrder', to: 'induction, behavior, targets, group'}
                        ], 
                        data: [
                                {
                    			    mixer: 'branch',
                                    conditions: [
                                        {compare: 'global.task', to: 'iat'}    
                                        ],
                                    data: [ 
                                            {
                                                mixer: 'choose',
                                                n:1,
                                                data: [
                                                        {
                                                            mixer: 'wrapper', //lrn	bvrate	del	delgroup	iat	iatgroup
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},       
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},  
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}                                            
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //lrn	bvrate	iat	iatgroup	del	delgroup
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},        
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},                       
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}                                                                    
                                                                ]
                                                        }, 
                                                        {
                                                            mixer: 'wrapper', //lrn	bvrate	del	iatgroup	iat	delgroup
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},      
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}                                                                     
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //lrn	bvrate	iat	delgroup	del	iatgroup
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},  
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}                                                                    
                                                                ]
                                                        }
                                                    ]
                                            } // close choose mixer
                                        ],
                                    elseData: [ // ep
                                                {
                                                    mixer: 'choose',
                                                    n:1,
                                                    data: [
                                                            {
                                                                mixer: 'wrapper', //lrn	bvrate	del	delgroup	ep
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},   
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},   
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},           
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'}                                               
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	bvrate	ep	del	delgroup
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},   
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},        
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}                                                                        
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	bvrate	del	ep	delgroup
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},   
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},       
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}                                                                          
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	bvrate	ep	delgroup	del
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},   
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},     
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}                                                                        
                                                                    ]
                                                            }                                                            
                                                    ] 
                                                }// close choose mixer
                                            ] // close else
                                } // close iat/ep branch                            
                            ] // close 4th measure order
                        },
                      {
                        conditions: [ // m-o 5
                          {compare: 'global.measuresOrder', to: 'induction, group, behavior, targets'}
                        ], 
                        data: [
                                {
                    			    mixer: 'branch',
                                    conditions: [
                                        {compare: 'global.task', to: 'iat'}    
                                        ],
                                    data: [ 
                                            {
                                                mixer: 'choose',
                                                n:1,
                                                data: [
                                                        {
                                                            mixer: 'wrapper', //lrn	delgroup	iatgroup	bvrate	del	iat
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},   
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},    
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'}                                            
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //lrn	iatgroup	delgroup	bvrate	iat	del
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}, 
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'}                                                                    
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //lrn	delgroup	iatgroup	bvrate	iat	del
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}, 
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'}                                                                      
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //lrn	iatgroup	delgroup	bvrate	del	iat
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}, 
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'}                                                                    
                                                                ]
                                                        }                                                        
                                                    ]
                                            } // close choose mixer
                                        ],
                                    elseData: [
                                                {
                                                    mixer: 'choose',
                                                    n:1,
                                                    data: [
                                                            {
                                                                mixer: 'wrapper', //lrn	delgroup	ep	bvrate	del
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},      
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},  
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}                                            
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	ep	delgroup	bvrate	del
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}, 
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}                                                                           
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	delgroup	del	bvrate	ep
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},                                                                             
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}, 
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'}                                                                        
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	ep	delgroup	bvrate	del
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'}, 
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}, 
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}                                                                        
                                                                    ]
                                                            }
                                                        ]
                                                } // close choose mixer
                                        ] //close else
                                }  //close iat/ep branch                        
                            ] // close 5th measure order
                        },
                      {
                        conditions: [ // m-o 6
                          {compare: 'global.measuresOrder', to: 'induction, targets, behavior, group'}
                        ], 
                        data: [
                                {
                    			    mixer: 'branch',
                                    conditions: [
                                        {compare: 'global.task', to: 'iat'}    
                                        ],
                                    data: [ 
                                            {
                                                mixer: 'choose',
                                                n:1,
                                                data: [
                                                        {
                                                            mixer: 'wrapper', // lrn	del	iat	bvrate	delgroup	iatgroup
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},  
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}                                            
                                                                ]
                                                        },
                                                         {
                                                            mixer: 'wrapper', // lrn	iat	del	bvrate	iatgroup	delgroup
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},  
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},                                                                    
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                                                    
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // lrn	del	iat	bvrate	iatgroup	delgroup
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},  
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                                                    
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'}
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // lrn	iat	del	bvrate	delgroup	iatgroup
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},  
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},                                                                    
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}                                            
                                                                ]
                                                        }                                                        
                                                    ]
                                            } // close choose mixer
                                        ],
                                    elseData: [ // ep
                                                {
                                                    mixer: 'choose',
                                                    n:1,
                                                    data: [
                                                            {
                                                                mixer: 'wrapper', //lrn	del	ep	bvrate	delgroup
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},  
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}                                            
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	del	bvrate	delgroup	ep
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},  
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},                                                                        
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'}
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	ep	del	bvrate	delgroup
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},  
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}                                                                        
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', //lrn	del	bvrate	ep	delgroup
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},  
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}                                                                        
                                                                    ]
                                                            }                                                            
                                                        ]
                                                } // close choose mixer
                                            ]
                                } // close iat/ep mixer                           
                            ] // close 6th measure order
                        },                        
                     {
                        conditions: [ // m-o 7
                          {compare: 'global.measuresOrder', to: 'induction, group, targets, behavior'}
                        ], 
                        data: [
                                {
                    			    mixer: 'branch',
                                    conditions: [
                                        {compare: 'global.task', to: 'iat'}    
                                        ],
                                    data: [ 
                                            {
                                                mixer: 'choose',
                                                n:1,
                                                data: [
                                                        {
                                                            mixer: 'wrapper', //lrn	delgroup	iatgroup	del	iat	bvrate
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'}                                            
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', //lrn	iatgroup	delgroup	iat	del	bvrate
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'}                                                                    
                                                                ]
                                                        },                                                        
                                                        {
                                                            mixer: 'wrapper', //lrn	delgroup	iatgroup	iat	del	bvrate
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'}                                                                    
                                                                ]
                                                        },                                                        
                                                        {
                                                            mixer: 'wrapper', //lrn	iatgroup	delgroup	del	iat	bvrate
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'}                                                                       
                                                                ]
                                                        }                                                        
                                                    ]
                                            } // close choose mixer
                                        ],
                                    elseData: [ // ep
                                                {
                                                    mixer: 'choose',
                                                    n:1,
                                                    data: [
                                                            {
                                                                mixer: 'wrapper', // lrn	delgroup	ep	del	bvrate
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},                                            
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'}                                            
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', // lrn	ep	delgroup	del	bvrate
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'}, 
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'}                                                                         
                                                                    ]
                                                            },                                                            
                                                             {
                                                                mixer: 'wrapper', // lrn	delgroup	del	ep	bvrate
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},  
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'}                                                                          
                                                                    ]
                                                            }                                                           
                                                        ]
                                                } //close chooes mixer
                                            ]
                                } // close iat/ep branch                           
                            ] // close 7th measure order
                        },                      
                     {
                        conditions: [ // m-o 8
                          {compare: 'global.measuresOrder', to: 'induction, targets, group, behavior'}
                        ], 
                        data: [
                                {
                    			    mixer: 'branch',
                                    conditions: [
                                        {compare: 'global.task', to: 'iat'}    
                                        ],
                                    data: [ 
                                            {
                                                mixer: 'choose',
                                                n:1,
                                                data: [
                                                        {
                                                            mixer: 'wrapper', // lrn	del	iat	delgroup	iatgroup	bvrate
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'}, 
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},   
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                            
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'}                                                 
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // lrn	iat	del	iatgroup	delgroup	bvrate
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'}, 
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'}, 
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'}                                                                       
                                                                ]
                                                        },                                                        
                                                        {
                                                            mixer: 'wrapper', // lrn	del	iat	iatgroup	delgroup	bvrate
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'}, 
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'},   
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'groupiat'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'}                                                                    
                                                                ]
                                                        },
                                                        {
                                                            mixer: 'wrapper', // lrn	iat	del	delgroup	iatgroup	bvrate
                                                            data: [
                                                                    {inherit:'prelrn'},
                                                                    {inherit:'instlrn'},
                                                                    {inherit:'lrn'}, 
                                                                    {inherit:'instiat'},
                                                                    {inherit:'iat'},
                                                                    {inherit:'instdel'},
                                                                    {inherit:'del'}, 
                                                                    {inherit:'instgroupdel'},
                                                                    {inherit:'groupdel'},
                                                                    {inherit:'instgroupiat'},
                                                                    {inherit:'groupiat'},                                            
                                                                    {inherit:'instrate'},
                                                                    {inherit:'ratebv'}                                                                      
                                                                ]
                                                        }                                                        
                                                    ]
                                            } // close choose mixer
                                        ],
                                    elseData: [ // ep
                                                {
                                                    mixer: 'choose',
                                                    n:1,
                                                    data: [
                                                            {
                                                                mixer: 'wrapper', // lrn	del	delgroup	ep	bvrate
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},  
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},                                            
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'}                                               
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', // lrn	ep	del	delgroup	bvrate
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},  
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'}, 
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'}                                                                           
                                                                    ]
                                                            },
                                                            {
                                                                mixer: 'wrapper', // lrn	del	ep	delgroup	bvrate
                                                                data: [
                                                                        {inherit:'prelrn'},
                                                                        {inherit:'instlrn'},
                                                                        {inherit:'lrn'},  
                                                                        {inherit:'instdel'},
                                                                        {inherit:'del'},     
                                                                        {inherit:'instep'},
                                                                        {inherit:'ep'},
                                                                        {inherit:'instgroupdel'},
                                                                        {inherit:'groupdel'},
                                                                        {inherit:'instrate'},
                                                                        {inherit:'ratebv'}                                                                         
                                                                    ]
                                                            }                                                            
                                                        ]
                                                } // close choose mixer    
                                        ] 
                                } // close iat/ep branch                           
                            ] // close 8th measure order
                        }
                ] // close condition branches
        },  // close branch mixer  
		{inherit:'debriefing'}
	]);

	return API.script;
});



