var pathArray = window.location.pathname.split( '/' );
var userId = pathArray[2];
var profileApi = "http://localhost:8000/api/profiles/" + userId + "/";
var csrfToken = Cookies.get('csrftoken');

console.log("User ID:", userId);

// React App
var Profile = React.createClass({
  getInitialState: function() {
    return {
      profile: {},
      mySkillsets: {},
      allSkillsets: {},
      activeSkillset: {"id": null},
      activeSkill: {"id": null},
      // mySkillsets: {},
      // allSkillsets: {},
      // mySkillsHash: {},
      // allSkillsHash: {}
    };
  },
  componentDidMount: function() {
    $.when(ajaxProfile(), ajaxMySkills(), ajaxMySkillsets(), ajaxAllSkills(), ajaxAllSkillsets()).done(function(a1,a2,a3,a4,a5) {
      console.log("API Calls Complete");

      // From API
      var profile = a1[0];
      var ajaxMySkills = a2[0];
      var ajaxMySkillsets = a3[0];
      var ajaxAllSkills = a4[0];
      var ajaxAllSkillsets = a5[0];

      // New Maps
      var allSkillsets = {};   
      // var mySkillsets = {};
      // var mySkillsHash = {};
      // var allSkillsHash = {};
      var mySkillsets = {};

      // Create allSkillsets
      for (var i = 0; i < ajaxAllSkillsets.length; i++) {
        allSkillsets[ajaxAllSkillsets[i].id] = JSON.parse(JSON.stringify(ajaxAllSkillsets[i]));
        allSkillsets[ajaxAllSkillsets[i].id].skills = {};
        allSkillsets[ajaxAllSkillsets[i].id].active = false;
        for (var y = 0; y < ajaxAllSkills.length; y++) {
          if (ajaxAllSkills[y].skillset_id === ajaxAllSkillsets[i].id) {
            allSkillsets[ajaxAllSkillsets[i].id].skills[ajaxAllSkills[y].id] = ajaxAllSkills[y];
            allSkillsets[ajaxAllSkillsets[i].id].skills[ajaxAllSkills[y].id].active = false;
          }
        }
      }

      // Add active properties to allSkillsets
      for (var i = 0; i < profile.skillset_ids.length; i++) {
        allSkillsets[profile.skillset_ids[i]].active = true;

      }

      // Create TShape Relationships
      // for (var i = 0; i < ajaxMySkillsets.length; i++) {
      _.forEach(ajaxMySkillsets, function(v, k) {
        mySkillsets[v.id] = JSON.parse(JSON.stringify(v));
        delete mySkillsets[v.id].skill_ids;
        delete mySkillsets[v.id].skills;
        mySkillsets[v.id].skills = [];
        allSkillsets[v.id].active = true;
        for (var y = 0; y < 10; y++) {
          _.forEach(ajaxMySkills, function(vv, kk) {
            if (vv.skillset_id === v.id && vv.profile_weight - 1 === y) {
              mySkillsets[v.id].skills[y] = vv;
              allSkillsets[v.id].skills[vv.id].active = true;
            } 
          });
          if (mySkillsets[v.id].skills[y] === undefined) {
            mySkillsets[v.id].skills[y] = {};
          }
        }
        // }
      });

      console.log("mySkillsets", mySkillsets);
      console.log("allSkillsets", allSkillsets);

      // // Add all skills to allSkillsets
      // _.forEach(allSkills, function(v, k) {
      //   allSkillsets[v.skillset_id].skills.push(v)
      // });

      // // Add active property to allSkillsets
      // _.forEach(mySkillsets, function(v, k) {
      //   allSkillsets[v.id].active = true;
      // });

      // // Create mySkillsHash 
      // _.forEach(mySkills, function(v, k) {
      //   v.active = true;
      //   mySkillsHash[v.id] = v;
      // });

      // //Create allSkillsHash
      // _.forEach(allSkills, function(v, k) {
      //   mySkillsHash[v.id] ? v.active = true : v.active = false;
      //   allSkillsHash[v.id] = v;
      // });

      // Update React state
      this.setState({
        profile: profile,
        mySkillsets: mySkillsets,
        allSkillsets: allSkillsets
        // mySkillsets: mySkillsets,
        // allSkillsets: allSkillsets,
        // mySkillsHash: mySkillsHash,
        // allSkillsHash: allSkillsHash
      });

    }.bind(this));

    // Get the Profile Object
    function ajaxProfile() {
      return $.ajax({
        url: "http://localhost:8000/api/profiles/1/",
        dataType: 'json',
        cache: false,
        success: function(response) {

        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
    // Get My Skills Object
    function ajaxMySkills() {
      return $.ajax({
        url: "http://localhost:8000/api/profiles/1/skills/",
        dataType: 'json',
        success: function(response) {

        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
    // Get My Skillsets Object
    function ajaxMySkillsets() {
      return $.ajax({
        url: "http://localhost:8000/api/profiles/1/skillsets/",
        dataType: 'json',
        success: function(response) {

        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
     // Get All Skills Object
    function ajaxAllSkills() {
      return $.ajax({
        url: "http://localhost:8000/api/skills/",
        dataType: 'json',
        success: function(response) {

        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
    // Get All Skillsets Object
    function ajaxAllSkillsets() {
      return $.ajax({
        url: "http://localhost:8000/api/skillsets/",
        headers: {
          'X-CSRFToken': csrfToken,
          "content-type": "application/json",
          "cache-control": "no-cache"
        },
        success: function(response) {
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  checkIfSkillExists: function(skill) {
    var allSkills = this.state.allSkillsHash;
    for (var item in allSkills) {
      if (allSkillsets[item].name === skill.name) {
        return allSkillsets[item];
      }
    }
    return false;
  },
  checkIfSkillsetExists: function(skillset) {
    var allSkillsets = this.state.allSkillsets;
    for (var item in allSkillsets) {
      if (allSkillsets[item].name === skillset.name) {
        return allSkillsets[item];
      }
    }
    return false;
  },
  checkIfSkillAdded: function(skill) {
    var newMySkillsets = this.state.mySkillsets;
    for (var item in newMySkillsets[skill.skillset_id]) {
      if (item.id === skill.name) {
        return item
      }
    }
    return false;
  },
  handleSkillsetCreate: function(skillset) {
    console.log("handleSkillsetCreate", skillset);

    var newSkillset = this.checkIfSkillsetExists(skillset);

    if (newSkillset) {
      console.log("Skillset already exists! Adding to Profile");
      this.handleSkillsetPut(newSkillset);
    } else {

      var data = JSON.stringify({"name": skillset.name});
      // If the skillset does not exist, POST the skillset to the API
      // On success this will return a new skillset object with a valid ID
      $.ajax({
        url: "http://localhost:8000/api/skillsets/",
        type: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
          "content-type": "application/json"
        },
        data: data,
        success: function(data) {
          console.log("handleSkillsetCreate AJAX success", data);
          this.handleSkillsetPut(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error("handleSkillsetCreate AJAX error", this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  handleSkillsetPut: function(skillset) {
    console.log("handleSkillsetPut", skillset);

    var newMySkillsets = this.state.mySkillsets;
    var newAllSkillsets = this.state.allSkillsets;

    if (this.state.mySkillsets[skillset.id]) {
      console.log("Skillset already added to this profile!");
      return false;
    // } else if (this.state.allSkillsets[skillset.id]) {
    //   // Add to mySkillsets
    //   newMySkillsets[skillset.id] = skillset
    //   newMySkillsets[skillset.id].skills = [];
    //   this.setState({
    //     mySkillsets: newMySkillsets
    //   });
    //   // Update allSkillsets
    //   newAllSkillsets[skillset.id].active = true;
    //   this.setState({
    //     allSkillsets: newAllSkillsets
    //   });
    } else {
      // Add to mySkillsets
      newMySkillsets[skillset.id] = skillset
      newMySkillsets[skillset.id].skills = [];
      this.setState({
        mySkillsets: newMySkillsets
      });
      // Add to allSkillsets
      newAllSkillsets[skillset.id] = skillset
      newAllSkillsets[skillset.id].skills = [];
      newAllSkillsets[skillset.id].active = true;
      this.setState({
        allSkillsets: newAllSkillsets
      });
    }

    this.setActiveSkillset(skillset);

    var data = JSON.stringify({"skillset_id": skillset.id, "profile_weight": 0});
    console.log("handleSkillsetPut API", data)

    $.ajax({
      url: "http://localhost:8000/api/profiles/1/skillsets/",
      method: "POST",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      data: data,
      success: function(data) {
        console.log("handleSkillsetPut AJAX Success", data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSkillsetRemove: function(skillset) {
    console.log("handleSkillsetRemove", skillset);

    var newMySkillsets = this.state.mySkillsets;
    var newAllSkillsets = this.state.allSkillsets;

    delete newMySkillsets[skillset.id]
    newAllSkillsets[skillset.id].active = false;
    
    this.setState({
      mySkillsets: newMySkillsets,
      allSkillsets: newAllSkillsets
    });

    this.setActiveSkillset({"id": null});

    // DELETE new skillsets object from API
    $.ajax({
      url: "http://localhost:8000/api/profiles/1/skillsets/" + skillset.id,
      method: "DELETE",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      success: function(data) {
        console.log("handleSkillsetRemove AJAX Success", data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSkillCreate: function(skill) {
    console.log("handleSkillCreate", skill);

    var data = JSON.stringify({"name": skill.name, "skillset_id": skill.skillset_id});

    $.ajax({
      url: "http://localhost:8000/api/skills/",
      dataType: 'json',
      type: 'POST',
        headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      data: data,
      success: function(data) {
        console.log("handleSkillCreate AJAX success", data);
        this.handleSkillPut(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("handleSkillCreate AJAX error", this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSkillPut: function(skill) {
    console.log("handleSkillPut", skill);

    var newMySkillsets = this.state.mySkillsets;
    var newAllSkillsets = this.state.allSkillsets;

    skill.active = true;

    // Check if the skill is already added to the users profile.
    if (this.checkIfSkillAdded(skill)) {
      console.log("Skill already added to this profile!");
      return false;
    // // Check if the skill is already added to global skills
    // else if (this.state.allSkillsHash[skill.id]) {
    //   newMySkillsets[skill.skillset_id].skills.push(skill);
    //   newMySkillsHash[skill.id] = skill;
    //   this.setState({
    //     mySkillsets: newMySkillsets,
    //     mySkillsHash: newMySkillsHash,
    //   });
    } else {
      // add the skill to mySkillsets
      if (skill.weight) {
        newMySkillsets[skill.skillset_id].skills[skill.weight -1] = skill;
      } else if (skill.profile_weight) {
        newMySkillsets[skill.skillset_id].skills[skill.profile_weight -1] = skill;
      }
      
      newAllSkillsets[skill.skillset_id].skills[skill.id] = skill

      this.setState({
        mySkillsets: newMySkillsets,
        allSkillsets: newAllSkillsets,
      });
    }
    
    var weight = 0;
    var data = null;
    if (skill.weight) {
      data = JSON.stringify({"skill_id": skill.id, "profile_weight": skill.weight});
    } else if (skill.profile_weight) {
      data = JSON.stringify({"skill_id": skill.id, "profile_weight": skill.profile_weight});
    }

    console.log("handleSkillPut API", data)
    $.ajax({
      url: "http://localhost:8000/api/profiles/1/skills/",
      method: "POST",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      data: data,
      success: function(data) {
        console.log("handleSkillPut AJAX Success", data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSkillRemove: function(skill) {
    console.log("handleSkillRemove", skill);

    var newMySkillsets = this.state.mySkillsets;
    var newAllSkillsets = this.state.allSkillsets;

    // Remove the skill from mySkillsets
    if (skill.weight) {
      newMySkillsets[skill.skillset_id].skills[skill.weight - 1] = {};
    } else if (skill.profile_weight) {
      newMySkillsets[skill.skillset_id].skills[skill.profile_weight - 1] = {};
    }

    // Set the skill to inactive in allSkillsets
    newAllSkillsets[skill.skillset_id].skills[skill.id].active = false;
    
    // Set React state
    this.setState({
      mySkillsets: newMySkillsets,
      allSkillsets: newAllSkillsets
    });

    // Update API
    $.ajax({
      url: "http://localhost:8000/api/profiles/1/skills/" + skill.id,
      method: "DELETE",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      success: function(data) {
        console.log("handleSkillRemove AJAX Success", data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  setActiveSkillset: function(skillset) {
    console.log("setActiveSkillset", skillset);
    this.setState({
      activeSkillset: skillset
    });
  },
  setActiveSkill: function(skill) {
    console.log("setActiveSkill", skill);
    this.setState({
      activeSkill: skill
    });
  },
  render: function() {
    var skillsetsSorted = _.sortBy(this.state.mySkillsets, ['profile_weight']);
    return (
      <div>
      <div className="strip">
        <div className="row">
          <div className="column small-12">

            <div className="tshape-horizontal">
              <div className="tshape__header">
                  <div className="tshape__avatar"></div>
                  <h2 className="tshape__role">UI Engineer</h2>
                  <h3 className="tshape__user">Robert Austin</h3>
                  <div className="tshape__badges">
                      <span className="tshape__github"><a href="#"><i className="fa fa-github" aria-hidden="true"></i></a></span>
                      <span className="tshape__linkedin"><a href="#"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a></span>
                  </div>
              </div>
              <div className="tshape__guide">
                 <span className="tshape__guide-beginner">Beginner</span>
                 <span className="tshape__guide-mastery">Mastery</span>
                 <ul className="tshape__guide-levels">
                   <li>1</li>
                   <li>2</li>
                   <li>3</li>
                   <li>4</li>
                   <li>5</li>
                   <li>6</li>
                   <li>7</li>
                   <li>8</li>
                   <li>9</li>
                   <li>10</li>
                </ul>
              </div>
              <div className="tshape__middle">
                {skillsetsSorted.map(function(value, key) {
                  return (
                    <Tshape 
                      key={key} 
                      skillset={value} 
                      activeSkillset={this.state.activeSkillset} 
                      setActiveSkill={this.setActiveSkill} 
                    />
                  )
                }.bind(this))}
              </div>
            </div>

          </div>
          <div className="column small-12">
            <SkillDescription 
                activeSkill={this.state.activeSkill} 
              />
            </div>
        </div>
      </div>
      <div className="strip">
        <div className="row">
          <div className="column small-12">
            <div className="skillsets">
              <div className="row">
                <div className="column small-7">
                 <div className="skillsets__panel--my-skillsets">
                    <h3>My Skillsets</h3>
                    {Object.keys(this.state.mySkillsets).map(function(value, key) {
                      return (
                        <MySkillsetItem 
                          key={key} 
                          skillset={this.state.mySkillsets[value]}
                          activeSkillset={this.state.activeSkillset} 
                          setActiveSkillset={this.setActiveSkillset} 
                          onRemove={this.handleSkillsetRemove} 
                        />
                      )
                    }.bind(this))}
                  </div>
                </div>
                <div className="column small-5">
                  <div className="skillsets__panel--all-skillsets">
                    <h3>All Skillsets</h3>
                    <AddSkillset 
                      onSkillsetSubmit={this.handleSkillsetCreate} 
                    />
                    {Object.keys(this.state.allSkillsets).map(function(value, key) {
                      return (
                        <AllSkillsetItem 
                          key={key}
                          skillset={this.state.allSkillsets[value]}
                          activeSkillset={this.state.activeSkillset} 
                          onAdd={this.handleSkillsetCreate} 
                        />
                      )
                    }.bind(this))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="strip">
        <div className="row">
          <div className="column small-12">
            <div className="skills">
              <div className="row">
                <div className="column small-7">
                  <div className="skills__panel--my-skills">
                    <h3 className="skills__heading skills__heading-myskills">My <span>{this.state.activeSkillset.name}</span> Skills</h3>
                    <MySkillItem 
                      skills={this.state.mySkillsets}  
                      activeSkillset={this.state.activeSkillset} 
                      onRemove={this.handleSkillRemove} 
                    />
                  </div>
                </div>
                <div className="column small-5">
                  <div className="skills__panel--all-skills">
                     <h3 className="skills__heading skills__heading-myskills">All <span>{this.state.activeSkillset.name}</span> Skills</h3>
                    <AddSkill 
                      skillsets={this.state.skillsets} 
                      activeSkillset={this.state.activeSkillset}
                      onSkillSubmit={this.handleSkillCreate} 
                    />
                    <AllSkillItem 
                      skillset={this.state.allSkillsets[this.state.activeSkillset.id]}  
                      activeSkillset={this.state.activeSkillset} 
                      onAdd={this.handleSkillPut} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
});

var Tshape = React.createClass({
    setActive: function(item) {
      return function(e) {
        e.preventDefault();
        return this.props.setActiveSkill(item);
      }.bind(this);
    },
    render: function(){
      return (
        <div className={"tshape__skillset " + (this.props.activeSkillset.id === this.props.skillset.id ? "active" : "inactive")} id={this.props.skillset.id}>
          <div className="tshape__skillset-heading">{this.props.skillset.name}</div>
            <div className="tshape__skill-container">
            {this.props.skillset.skills.map(function(value, key) {
              if (_.isEmpty(value)) {
                return false;
              } else {
                return (
                  <div className="tshape__skill" key={key} id={value.id} onClick={this.setActive(value)}>
                    <div className="tshape__skillname">{value.id}</div>
                  </div>
                )
              }
            }.bind(this))}
          </div>
        </div>
      );
    }
});

var MySkillsetItem = React.createClass({
  setActive: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.setActiveSkillset(item);
    }.bind(this);
  },
  remove: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onRemove(item);
    }.bind(this);
  },
  render: function() {
    return (
      <div className={"skillset__item skillset__item--tag " + (this.props.activeSkillset.id === this.props.skillset.id ? "selected" : "not-selected") }>
        <span className="skillset__weight">1</span>
        <span className="skillset__name" onClick={this.setActive(this.props.skillset)}>{this.props.skillset.name}</span>
        <a className="skillset__remove" href="#" onClick={this.remove(this.props.skillset)}>X</a>
      </div>
    )
  }
});
var AllSkillsetItem = React.createClass({
  add: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onAdd(item);
    }.bind(this);
  },
  render: function() {
    if (this.props.skillset.active) {
      return (
        <li className={"skillset__item skillset__item--text active " + (this.props.activeSkillset.id === this.props.skillset.id ? "selected" : "not-selected")}>
          <span>{this.props.skillset.name}</span>
        </li>
      )
    } else {
      return (
        <li className={"skillset__item skillset__item--text inactive"}>
          <a href="#" className="skillset__link" onClick={this.add(this.props.skillset)}>{this.props.skillset.name}</a>
        </li>
      )
    }
  }
});
var AddSkillset = React.createClass({
  getInitialState: function() {
    return {
      name: ''
    };
  },
  handleNameFieldChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    if (!name) {
      return;
    }
    this.props.onSkillsetSubmit({name: name});
    this.setState({name: ''});
  },
  render: function() {
    return (
      <form className="skillset__add-skillset-form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          ref="name"
          placeholder="Skillset Name"
          value={this.state.name}
          onChange={this.handleNameFieldChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var MySkillItem = React.createClass({
  setActive: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.setActive(item);
    }.bind(this);
  },
  remove: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onRemove(item);
    }.bind(this);
  },
  render: function() {
    if (this.props.activeSkillset.id === null) {
      var items = <li>Please select a skillset</li>
    } else if(this.props.activeSkillset.id !== null) {
      var items = this.props.activeSkillset.skills.map(function(value, key) {
        if (_.isEmpty(value)) {
          return (
            <div className="skill__item skill__item--row" key={key}>
              <span className="skill__weight">{key + 1}</span>
              <span className="skill__name">no skill</span>
            </div>
          )
        } else {
          return (
            <div className="skill__item skill__item--row" key={key}>
              <span className="skill__weight">{key + 1}</span>
              <span className="skill__name">{value.name}</span>
              <a href="#" className="skill__remove" onClick={this.remove(value)}>X</a>
            </div>
          )
        }
      }.bind(this))
    } 
    return (
      <div className="skill__my-skills">{items}</div>
    );
  }
});
var AllSkillItem = React.createClass({
  add: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onAdd(item);
    }.bind(this);
  },
  render: function() {

    if (this.props.activeSkillset.id === null) {
      var noSkillItems = <li>Please select a skillset</li>
    } else if(this.props.activeSkillset.id !== null && this.props.skillset === null) {
      var noSkillItems = <li>No all skills</li>
    } else {
       var allSkillItems = Object.keys(this.props.skillset.skills);
      var allSkillItems = Object.keys(this.props.skillset.skills).map(function(value, key) {
        if (this.props.skillset.skills[value].active === true && this.props.skillset.skills[value].verified === false) {
          return (
            <li className={"skill__item active"} key={key}>
              <span>{this.props.skillset.skills[value].name}</span>
            </li>
          )
        } else if (this.props.skillset.skills[value].active === false && this.props.skillset.skills[value].verified === false) {
          return (
            <li className={"skill__item inactive"} key={key} >
               <a href="#" className="skill__link" onClick={this.add(this.props.skillset.skills[value])}>{this.props.skillset.skills[value].name}</a>
            </li>
          )
        }
      }.bind(this))
      var verifiedAllSkillItemsSorted = _.sortBy(this.props.skillset.skills, ['weight']);
      var verifiedAllSkillItems = verifiedAllSkillItemsSorted.map(function(value, key) {
        if (value.active === true && value.verified === true) {
          return (
            <li className={"skill__item skill__item--verified active"} key={key}>
              <span>{value.name} | {value.weight}</span>
            </li>
          )
        } else if (value.active === false && value.verified === true) {
          return (
            <li className={"skill__item skill__item--verified inactive"} key={key} >
               <a href="#" className="skill__link" onClick={this.add(value)}>{value.name} | {value.weight}</a>
            </li>
          )
        }
      }.bind(this))
    } 
    return (
      <div>
        <ul>{noSkillItems}</ul>
        <h4 className="skills__heading skills__heading-verified-skills">Verified <span>{this.props.activeSkillset.name}</span> Skills</h4>
        <ol>{verifiedAllSkillItems}</ol>
        <h4 className="skills__heading skills__heading-user-skills">User Suggested <span>{this.props.activeSkillset.name}</span> Skills</h4>
        <ul>{allSkillItems}</ul>
      </div>
    );
  }
});
var AddSkill = React.createClass({
  getInitialState: function() {
    return {
      skillset_id: '',
      name: ''
    };
  },
  handleSkillNameFieldChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleSkillDescriptionFieldChange: function(e) {
    this.setState({description: e.target.value});
  },
  handleSkillsetIdFieldChange: function(e) {
    this.setState({skillset_id: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var skillset_id = this.props.activeSkillset.id;

    if (!name || !skillset_id) {
      return;
    }
    this.props.onSkillSubmit({name: name, skillset_id: skillset_id});
    this.setState({name: '', skillset_id: ''});
  },
  render: function() {
    return (
      <form className="skill__add-skill-form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          ref="name"
          placeholder="Skill Name"
          value={this.state.name}
          onChange={this.handleSkillNameFieldChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var SkillDescription = React.createClass({
    render: function(){
      if (this.props.activeSkill.id === null) {
        var item = <div>Please select a skill</div>
      } else {
        var item = 
          <div>
            <div className="skill__description">{this.props.activeSkill.name}</div>
            <div className="skill__description">{this.props.activeSkill.description}</div>
          </div>
      }
      return <div>{item}</div>
    }
});

ReactDOM.render(
<Profile url={profileApi} />,
  document.getElementById('tshape')
);
