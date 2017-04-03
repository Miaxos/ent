module.exports = function(app, express, http) {
	
	var module = {}

	Date.prototype.yyyymmdd = function() {
	  var mm = this.getMonth() + 1; // getMonth() is zero-based
	  var dd = this.getDate();

	  return [this.getFullYear(),
	          (mm>9 ? '' : '0') + mm,
	          (dd>9 ? '' : '0') + dd
	         ].join('');
	};

	function n(n){
	// If the number > 9 -> string, else add a 0 and string;
	    return n > 9 ? "" + n: "0" + n;
	}

	function formatDate(entry) {
		date = entry.$.date
		var d = date.split('/');
		var realDate = new Date(Number(d[2]), Number(d[1])-1, Number(d[0])+1);
		realDate.setDate(realDate.getDate() + Number(entry.day[0])-1)

		return realDate.yyyymmdd();
	}
	function formatHeureDebut(heure) {
		var hours = Number(heure.slice(0,2))-2;
		return n(hours)+heure.slice(2,4);
	}
	function formatHeureFin(heure) {
		var hours = Number(heure.slice(4,6))-2;
		return n(hours)+heure.slice(6,8);
	}
	function formatSummary(entry) {
		var s = "SUMMARY:";
		s = s + entry.category[0];
		if (entry.resources !== undefined) {
			if (entry.resources.lenght !== 0) {
				if (entry.resources[0].module !== undefined) {
					if (entry.resources[0].module.lenght !== 0) {
						if (entry.resources[0].module[0].item.lenght !== 0) {
							s = s + " - " + entry.resources[0].module[0].item[0];
						}
					}
				}
				if (entry.resources[0].group !== undefined) {
					if (entry.resources[0].group.lenght !== 0) {
						if (entry.resources[0].group[0].item.lenght !== 0) {
							for (var i = 0; i < entry.resources[0].group[0].item.length; i++) {
								s = s + " - " + entry.resources[0].group[0].item[i];
							}
						}
					}
				}
				if (entry.notes !== undefined) {
					if (entry.notes.lenght !== 0) {
						s = s + '\nNotes:'
						s = s + entry.notes[0];
						for (var i = 1; i < entry.notes.length; i++) {
							s = s + " - " + entry.notes[i];
						}
					}
				}
			}
		}
		return s
	}
	function formatLocation(entry) {
		var s = "LOCATION:";
		if (entry.resources !== undefined) {
			if (entry.resources.lenght !== 0) {
				if (entry.resources[0].room !== undefined) {
					if (entry.resources[0].room.lenght !== 0) {
						if (entry.resources[0].room[0].item.lenght !== 0) {
							s = s + entry.resources[0].room[0].item[0];
							for (var i = 1; i < entry.resources[0].room[0].item.length; i++) {
								s = s + " - " + entry.resources[0].room[0].item[i];
							}
						}
					}
				}
			}
		}
		return s
	}
	function formatDescription(entry) {
		var s = "DESCRIPTION:";
			if (entry.resources !== undefined) {
				if (entry.resources.lenght !== 0) {
					if (entry.resources[0].module !== undefined) {
						if (entry.resources[0].module.lenght !== 0) {
							if (entry.resources[0].module[0].item.lenght !== 0) {
								s = s + "\\nMatière :" + entry.resources[0].module[0].item[0];
							}
						}
					}
					if (entry.resources[0].staff !== undefined) {
						if (entry.resources[0].staff.lenght !== 0) {
							if (entry.resources[0].staff[0].item.lenght !== 0) {
								s = s + "\\nPersonnel : ";
								s = s + entry.resources[0].staff[0].item[0];
								for (var i = 1; i < entry.resources[0].staff[0].item.length; i++) {
									s = s + " - " + entry.resources[0].staff[0].item[i];
								}
							}
						}
					}
					if (entry.resources[0].group !== undefined) {
						if (entry.resources[0].group.lenght !== 0) {
							if (entry.resources[0].group[0].item.lenght !== 0) {
								s = s + "\\nGroupe : ";
								s = s + entry.resources[0].group[0].item[0];
								for (var i = 1; i < entry.resources[0].group[0].item.length; i++) {
									s = s + ", " + entry.resources[0].group[0].item[i];
								}
							}
						}
					}
					if (entry.resources[0].room !== undefined) {
						if (entry.resources[0].room.lenght !== 0) {
							if (entry.resources[0].room[0].item.lenght !== 0) {
								s = s + "\\nSalle :";
								s = s + entry.resources[0].room[0].item[0];
								for (var i = 1; i < entry.resources[0].room[0].item.length; i++) {
									s = s + ", " + entry.resources[0].room[0].item[i];
								}
							}
						}
					}
				}
			}
			if (entry.notes !== undefined) {
				if (entry.notes.lenght !== 0) {
					s = s + "\\nRemarques: "
					s = s + entry.notes[0];
					for (var i = 1; i < entry.notes.length; i++) {
						s = s + ", " + entry.notes[i];
					}
				}
			}
		return s
	}

	var fs = require('fs'),
    	xml2js = require('xml2js');

	var parser = new xml2js.Parser();
	module.parse = function(callback, htmlcontent) {
		// console.log(htmlcontent);
		var s = "";
		// fs.readFile(__dirname + '/ent.xml', function(err, data) {
		    parser.parseString(htmlcontent, function (err, result) {
		    	/*
				BEGIN:VCALENDAR
				VERSION:2.0
				PRODID:-//www.celcat.fr//NONSGML CreateICSFiles//FR
				X-WR-CALNAME:2017



				BEGIN:VEVENT
				DTSTART:20160919T074500Z
				DTEND:20160919T090000Z
				UID:CELCAT - 2017 (92378-5)
				SUMMARY:Cours magistral - INFO-Analyse de données - ID\, ID4
				LOCATION:C008 (Ireste) 50pl + Vp
				DESCRIPTION:Matière : INFO-Analyse de données - ID\nPersonnel : KUNTZ Pascale\nGroupe : ID4\nSalle : C008 (Ireste) 50pl + Vp\n
				CATEGORIES:CELCAT Timetabler (vcal) - 2017
				END:VEVENT
		    	*/
		    	// var source = 'vetoical.ics'
		    	// fs.appendFileSync(source,'BEGIN:VCALENDAR\n');
		    	// fs.appendFileSync(source,'VERSION:2.0\n');
		    	// fs.appendFileSync(source,"PRODID:-//www.celcat.fr//NONSGML\nCreateICSFiles//FR\n");
		    	// fs.appendFileSync(source,"X-WR-CALNAME:VETO\n")
		    	// // fs.appendFileSync(source,"X-WR-TIMEZONE:Europe/Paris\n")
		    	// result.timetable.event.forEach((entry) => {
		    	// 	fs.appendFileSync(source,"BEGIN:VEVENT\n");
		    	// 	fs.appendFileSync(source,"DTSTART:"+formatDate(entry)+"T"+formatHeureDebut(entry.$.timesort)+"00Z\n");
		    	// 	fs.appendFileSync(source,"DTEND:"+formatDate(entry)+"T"+formatHeureFin(entry.$.timesort)+"00Z\n");
		    	// 	fs.appendFileSync(source,"UID:CELCAT - VETO ("+entry.$.id+")\n");
		    	// 	fs.appendFileSync(source,formatSummary(entry)+'\n');
		    	// 	fs.appendFileSync(source,formatLocation(entry)+'\n');
		    	// 	fs.appendFileSync(source,formatDescription(entry)+'\n');
		    	// 	fs.appendFileSync(source,'CATEGORIES:CELCAT Timetabler (vcal) - 2017\n')
		    	// 	fs.appendFileSync(source,'END:VEVENT\n');
		    	// });
		    	// fs.appendFileSync(source,"END:VCALENDAR\n");
		    	s += 'BEGIN:VCALENDAR\n';
		    	s += 'VERSION:2.0\n';
		    	s += "PRODID:-//www.celcat.fr//NONSGML\nCreateICSFiles//FR\n";
		    	s += "X-WR-CALNAME:VETO\n";
		    	result.timetable.event.forEach((entry) => {
		    		s += "BEGIN:VEVENT\n";
		    		s += "DTSTART:"+formatDate(entry)+"T"+formatHeureDebut(entry.$.timesort)+"00Z\n";
		    		s += "DTEND:"+formatDate(entry)+"T"+formatHeureFin(entry.$.timesort)+"00Z\n";
		    		s += "UID:CELCAT - VETO ("+entry.$.id+")\n";
		    		s += formatSummary(entry)+'\n';
		    		s += formatLocation(entry)+'\n';
		    		s += formatDescription(entry)+'\n';
		    		s += 'CATEGORIES:CELCAT Timetabler (vcal) - 2017\n';
		    		s += 'END:VEVENT\n';
		    	});
		    	s += "END:VCALENDAR\n";
		    	callback.end(s);
		    });
		// });
	};

	return module;
}