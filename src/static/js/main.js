var pathArray = window.location.pathname.split( '/' );
var userId = pathArray[2];
var apiBasePath = "/api/"
var apiProfilePath = "profiles/" + userId + "/";
var csrfToken = Cookies.get('csrftoken');

console.log("User ID:", userId);

// React App
var Profile = React.createClass({
  getInitialState: function() {
    return {
      profile: {},
      mySkillsets: [],
      allSkillsets: {},
      activeSkillset: {"id": null},
      activeSkill: {"id": null},
      display: {
        "allSkillsets": {
          "visible": true
        }
      }
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
      var mySkillsets = {};

      // Create allSkillsets
      for (var i = 0; i < ajaxAllSkillsets.length; i++) {
        allSkillsets[ajaxAllSkillsets[i].id] = JSON.parse(JSON.stringify(ajaxAllSkillsets[i]));
        delete allSkillsets[ajaxAllSkillsets[i].id].skill_ids;
        allSkillsets[ajaxAllSkillsets[i].id].skills = {};
        allSkillsets[ajaxAllSkillsets[i].id].active = false;
        for (var y = 0; y < ajaxAllSkills.length; y++) {
          if (ajaxAllSkills[y].skillset_id === ajaxAllSkillsets[i].id) {
            allSkillsets[ajaxAllSkillsets[i].id].skills[ajaxAllSkills[y].id] = JSON.parse(JSON.stringify(ajaxAllSkills[y]));
            allSkillsets[ajaxAllSkillsets[i].id].skills[ajaxAllSkills[y].id].active = false;
          }
        }
      }

      // Create Weighted mySkillsetsArray
      mySkillsets = _.sortBy(ajaxMySkillsets, ['profile_weight']);
      _.forEach(ajaxMySkillsets, function(v, k) {
        v.skills = [];
        allSkillsets[v.id].active = true;
        for (var y = 0; y < 10; y++) {
          _.forEach(ajaxMySkills, function(vv, kk) {
            if (vv.skillset_id === v.id && vv.profile_weight - 1 === y) {
              v.skills[y] = vv;
              allSkillsets[v.id].skills[vv.id].active = true;
            } 
          });
          if (v.skills[y] === undefined) {
            v.skills[y] = {};
          }
        }
      });

      // Create mySkillsetsHash
      // _.forEach(ajaxMySkillsets, function(v, k) {
      //   mySkillsets[v.id] = JSON.parse(JSON.stringify(v));
      //   delete mySkillsets[v.id].skill_ids;
      //   delete mySkillsets[v.id].skills;
      //   mySkillsets[v.id].skills = [];
      //   allSkillsets[v.id].active = true;
      //   for (var y = 0; y < 10; y++) {
      //     _.forEach(ajaxMySkills, function(vv, kk) {
      //       if (vv.skillset_id === v.id && vv.profile_weight - 1 === y) {
      //         mySkillsets[v.id].skills[y] = vv;
      //         allSkillsets[v.id].skills[vv.id].active = true;
      //       } 
      //     });
      //     if (mySkillsets[v.id].skills[y] === undefined) {
      //       mySkillsets[v.id].skills[y] = {};
      //     }
      //   }
      // });

      console.log("mySkillsets", mySkillsets);
      console.log("allSkillsets", allSkillsets);

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
        url: apiBasePath + apiProfilePath,
        dataType: 'json',
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
        url: apiBasePath + apiProfilePath + "skills/",
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
        url: apiBasePath + apiProfilePath + "skillsets/",
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
        url: apiBasePath + "skills/",
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
        url: apiBasePath + "skillsets/",
        dataType: 'json',
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
  checkIfSkillsetAdded: function(skillset) {
    var newMySkillsets = this.state.mySkillsets;
    return _.includes(newMySkillsets, skillset.id);
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
  getSkillsetWeight: function() {
    //Discover item with highest weight
    var newMySkillsets = this.state.mySkillsets;
    var weight = 0
    _.forEach(newMySkillsets, function(value, key) {
      if(value.profile_weight > weight) {
        weight = value.profile_weight;
      }
    })
    return weight;
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
        url: apiBasePath + "skillsets/",
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
    
    var weight = this.getSkillsetWeight();

    if (this.checkIfSkillsetAdded(skillset)) {
      console.log("Skillset already added to this profile!");
      return false;
    } else {
      // Add to allSkillsets
      newAllSkillsets[skillset.id] = skillset
      newAllSkillsets[skillset.id].active = true;

      // Add to mySkillsets
      var skillsetCopy = _.cloneDeep(skillset);
      console.log(skillsetCopy);
      skillsetCopy.skills = [];
      skillsetCopy.profile_weight = weight + 1;

      for (var y = 0; y < 10; y++) {
        skillsetCopy.skills[y] = {};
      }

      newMySkillsets.push(skillsetCopy);
      console.log(newMySkillsets)
      

      // Set State
      this.setState({
        mySkillsets: newMySkillsets,
        allSkillsets: newAllSkillsets
      });
    }

    this.setActiveSkillset(skillsetCopy);
    
    var data = JSON.stringify({"skillset_id": skillset.id, "profile_weight": weight + 1});
    console.log("handleSkillsetPut API", data)

    $.ajax({
      url: apiBasePath + apiProfilePath + "skillsets/",
      method: "POST",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      data: data,
      success: function(data, status) {
        console.log("handleSkillsetPut AJAX", status);
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

    // Remove the skillset from mySkillsets array
    _.remove(newMySkillsets, function(value) {
      return skillset.id === value.id;
    });

    // Update Weights
    // _.forEach(newMySkillsets, function(value, key) {
    //   value.profile_weight = key + 1;
    // });

    newAllSkillsets[skillset.id].active = false;
    
    this.setState({
      mySkillsets: newMySkillsets,
      allSkillsets: newAllSkillsets
    });

    this.setActiveSkillset({"id": null});

    // DELETE new skillsets object from API
    $.ajax({
      url: apiBasePath + apiProfilePath + "skillsets/" + skillset.id,
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
      url: apiBasePath + "skills/",
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

    // Verified Skills have the property "weight", Custom Skills have the property "profile_weight"
    var weightTitle = "";
    if (skill.weight) {
      weightTitle = "weight"
    } else {
      weightTitle = "profile_weight"
    }

    this.setActiveSkill(skill);

    // Check if the skill is already in mySkillsets
    if (this.checkIfSkillAdded(skill)) {
      console.log("Skill already added to this profile!");
      return false;
    } else {
      // Add the skill to mySkillsets
      _.forEach(newMySkillsets, function(value, key) {
        //  Find Array index of the skillset that contains the skill to be updated
        if (skill.skillset_id === value.id) {
          newMySkillsets[key].skills[skill[weightTitle] -1] = skill;
          console.log("Insert into skills array index", skill[weightTitle] -1);
        }
      })

      // Add the skill to allSkillsets
      newAllSkillsets[skill.skillset_id].skills[skill.id] = skill;

      this.setState({
        mySkillsets: newMySkillsets,
        allSkillsets: newAllSkillsets,
      });
    }

    // Prepare data for API call
    var data = JSON.stringify({"skill_id": skill.id, weightTitle: skill[weightTitle]});

    console.log("handleSkillPut API", data)
    $.ajax({
      url: apiBasePath + apiProfilePath + "skills/",
      method: "POST",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      data: data,
      success: function(data, status) {
        console.log("handleSkillPut AJAX", status);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("handleSkillPut AJAX", this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSkillRemove: function(skill) {
    console.log("handleSkillRemove", skill);

    var newMySkillsets = this.state.mySkillsets;
    var newAllSkillsets = this.state.allSkillsets;

    // Verified Skills have the property "weight", Custom Skills have the property "profile_weight"
    var weightTitle = "";
    if (skill.weight) {
      weightTitle = "weight"
    } else {
      weightTitle = "profile_weight"
    }

    // Add the skill to mySkillsets
    _.forEach(newMySkillsets, function(value, key) {
      //  Find Array index of the skillset that contains the skill to be updated
      if (skill.skillset_id === value.id) {
        newMySkillsets[key].skills[skill[weightTitle] -1] = {};
        console.log("Remove skill from skills array @ index", skill[weightTitle] -1);
      }
    });

    // Set the skill to inactive in allSkillsets
    newAllSkillsets[skill.skillset_id].skills[skill.id].active = false;

    // Set React state
    this.setState({
      mySkillsets: newMySkillsets,
      allSkillsets: newAllSkillsets
    });

    console.log("handleSkillRemove API DELETE skills/", skill.id);
        
    // Update API
    $.ajax({
      url: apiBasePath + apiProfilePath + "skills/" + skill.id,
      method: "DELETE",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      success: function(data, status) {
        console.log("handleSkillRemove AJAX", status);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  setActiveSkillset: function(skillset) {
    console.log("setActiveSkillset", skillset.name, skillset.id);
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
    var tshapeLength = this.state.mySkillsets.length * 40 + 160;
    var skillsetNameLowerCase = "";
    if(this.state.activeSkillset.name) {
      skillsetNameLowerCase = "skillset-name-" + this.state.activeSkillset.name.toLowerCase();
    }
    return (
      <div>
        <div className="strip">
          <div className="row">
            <div className="column small-12">

              <div className="tshape-vertical">
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
                <div className={"tshape__middle tshape-width-" + tshapeLength}>
                  <div className="tshape__wing tshape__wing--left-2"></div>
                  <div className="tshape__wing tshape__wing--left-1"></div>
                  {this.state.mySkillsets.map(function(value, key) {
                    return (
                      <Tshape 
                        key={key} 
                        skillset={value} 
                        activeSkillset={this.state.activeSkillset} 
                        setActiveSkill={this.setActiveSkill} 
                      />
                    )
                  }.bind(this))}
                  <div className="tshape__wing tshape__wing--right-1"></div>
                  <div className="tshape__wing tshape__wing--right-2"></div>
                </div>
                <div className="tshape__footer">
                  <SkillDescription 
                    activeSkill={this.state.activeSkill} 
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
        <div className="strip">
          <div className="row">
            <div className="column small-12">
              <div className="skillsets">
                <div className="row">
                  <div className="column small-12">
                    <div className="skillsets__panel--my-skillsets">
                      <h3>My Skillsets</h3>
                      {this.state.mySkillsets.map(function(value, key) {
                        return (
                          <MySkillsetItem 
                            key={key} 
                            skillset={value}
                            activeSkillset={this.state.activeSkillset} 
                            setActiveSkillset={this.setActiveSkillset} 
                            onRemove={this.handleSkillsetRemove} 
                          />
                        )
                      }.bind(this))}
                      <div className={"skillsets__panel--all-skillsets " + (this.state.display.allSkillsets.visible === true ? "show" : "hide")}>
                        {Object.keys(this.state.allSkillsets).map(function(value, key) {
                          return (
                            <AllSkillsetItem 
                              key={key}
                              skillset={this.state.allSkillsets[value]}
                              activeSkillset={this.state.activeSkillset} 
                              onAdd={this.handleSkillsetPut} 
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
        </div>
        <div className="strip">
          <Skills
            key="1"
            allSkillset={this.state.allSkillsets[this.state.activeSkillset.id]}  
            mySkillset={this.state.mySkillsets[this.state.activeSkillset.id]}  
            activeSkillset={this.state.activeSkillset} 
            activeSkill={this.state.activeSkill} 
            onAdd={this.handleSkillPut} 
            onRemove={this.handleSkillRemove} 
            onShow={this.setActiveSkill}
          />   
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
      
      var skillsetNameLowerCase = "";
      if(this.props.skillset.name) {
        skillsetNameLowerCase = "skillset-name-" + this.props.skillset.name.toLowerCase();
      }

      return (
        <div className={"tshape__skillset " + skillsetNameLowerCase + " " + (this.props.activeSkillset.id === this.props.skillset.id ? "active" : "inactive")} id={this.props.skillset.id}>
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
        <span className="skillset__weight">{this.props.skillset.profile_weight}</span>
        <span className="skillset__id">{this.props.skillset.id}</span>
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
var SkillList = React.createClass({
  add: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onAdd(item);
    }.bind(this);
  },
  remove: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onRemove(item);
    }.bind(this);
  },
  show: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onShow(item);
    }.bind(this);
  },
  render: function() {
    var verifiedAllSkillItems = [];
    if (this.props.activeSkillset.id === null) {
      var noSkillItems = <li>Please select a skillset</li>
    } else if(this.props.activeSkillset.id !== null && this.props.skillset === null) {
      var noSkillItems = <li>No all skills</li>
    } else {
      var verifiedAllSkillItemsSorted = _.sortBy(this.props.allSkillset.skills, ['weight']);
      var verifiedAllSkillItems = verifiedAllSkillItemsSorted.map(function(value, key) {
        if (value.active === true && value.verified === true) {
          return (
            <div className={"skill__item skill__item--verified active"} key={key}>
              <a href="#" className="skill__tickbox skill__tickbox--ticked" onClick={this.remove(value)}></a>
              <a href="#" className="skill__name" onClick={this.show(value)}>{value.name} | {value.weight}</a>
            </div>
          )
        } else if (value.active === false && value.verified === true) {
          return (
            <div className={"skill__item skill__item--verified inactive"} key={key} >
               <a href="#" className="skill__tickbox skill__tickbox--unticked" onClick={this.add(value)}></a>
               <a href="#" className="skill__name" onClick={this.show(value)}>{value.name} | {value.weight}</a>
            </div>
          )
        }
      }.bind(this))
    }
    return (
      <div>{verifiedAllSkillItems}</div>
    )
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
    // <AddSkill 
    //   skillsets={this.state.skillsets} 
    //   activeSkillset={this.state.activeSkillset}
    //   onSkillSubmit={this.handleSkillCreate} 
    // />
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
        <div className={"skill-info"} >
          <h3 className="skill-info__name">{this.props.activeSkill.name}</h3>
          <p className="skill-info__description">{this.props.activeSkill.description}</p>
        </div>
    }
    return <div>{item}</div>
  }
});

var Skills = React.createClass({
  add: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onAdd(item);
    }.bind(this);
  },
  remove: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onRemove(item);
    }.bind(this);
  },
  show: function(item) {
    return function(e) {
      e.preventDefault();
      return this.props.onShow(item);
    }.bind(this);
  },
  render: function() {

    var skillsetNameLowerCase = "";
    if(this.props.activeSkillset.name) {
      skillsetNameLowerCase = "skillset-name-" + this.props.activeSkillset.name.toLowerCase();
    }

    var skills = [];
    var skillsSorted = [];

    if (this.props.activeSkillset.id === null) {
      skills = <li>Please select a skillset</li>
    } else if(this.props.activeSkillset.id !== null && this.props.skillset === null) {
      skills = <li>No all skills</li>
    } else {
      skillsSorted = _.sortBy(this.props.allSkillset.skills, ['weight']);
      skills = skillsSorted.map(function(value, key) {
        if (value.active === true && value.verified === true) {
          return (
            <div className={"skill__item skill__item--verified active"} key={key}>
              <a href="#" className="skill__tickbox skill__tickbox--ticked" onClick={this.remove(value)}></a>
              <a href="#" className="skill__name" onClick={this.show(value)} >{value.name} | {value.weight}</a>
            </div>
          )
        } else if (value.active === false && value.verified === true) {
          return (
            <div className={"skill__item skill__item--verified inactive"} key={key} >
               <a href="#" className="skill__tickbox skill__tickbox--unticked" onClick={this.add(value)}></a>
               <a href="#" className="skill__name" onClick={this.show(value)} >{value.name} | {value.weight}</a>
            </div>
          )
        }
      }.bind(this))
    }

    var skillDescription = null;

    if (this.props.activeSkill.id === null) {
      skillDescription = <div>Please select a skill</div>
    } else {
      skillDescription = (
        <div className={"skill-info"} >
          <h5 className="skill-info__name">{this.props.activeSkillset.name}</h5>
          <h3 className="skill-info__name">{this.props.activeSkill.name}</h3>
          <p className="skill-info__description">{this.props.activeSkill.description}</p>
        </div>
      )
    }
    
    return (
      <div className={"skills " + skillsetNameLowerCase}>
        <div className="row">
          <div className="column small-7">
            <h3 className="skills__heading skills__heading-myskills">My <span>{this.props.activeSkillset.name}</span> Skills</h3>
            <div className="skills__panel--my-skills">
              {skills}
            </div>
          </div>
          <div className="column small-5">
            <div className="skills__panel--all-skills">
              {skillDescription}
            </div>
          </div>
        </div>
      </div>
    )
    
    
  }
});

ReactDOM.render(
<Profile url={apiBasePath} />,
  document.getElementById('tshape')
);
