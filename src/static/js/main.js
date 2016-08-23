var pathArray = window.location.pathname.split( '/' );
var userId = pathArray[2];
var profileApi = "http://dev.tshape.com:8000/api/profiles/" + userId + "/";
var csrfToken = Cookies.get('csrftoken');

console.log("User ID:", userId);

// React App
var Profile = React.createClass({
  getInitialState: function() {
    return {
      profile: {},
      activeSkillset: {"id": null},
      mySkillsetsHash: {},
      allSkillsetsHash: {},
      mySkillsHash: {},
      allSkillsHash: {}
    };
  },
  componentDidMount: function() {
    $.when(ajaxProfile(), ajaxMySkills(), ajaxMySkillsets(), ajaxAllSkills(), ajaxAllSkillsets()).done(function(a1,a2,a3,a4,a5) {
      console.log("API Calls Complete");

      // From API
      var profile = a1[0];
      var mySkills = a2[0];
      var mySkillsets = a3[0];
      var allSkills = a4[0];
      var allSkillsets = a5[0];

      // New Maps
      var allSkillsetsHash = {};   
      var mySkillsetsHash = {};
      var mySkillsHash = {};
      var allSkillsHash = {};

      //Create mySkillsetsHash 
      _.forEach(mySkillsets, function(v, k) {
        v.active = true;
        mySkillsetsHash[v.id] = v;
        delete mySkillsetsHash[v.id].skill_ids
        mySkillsetsHash[v.id].skills = [];
      });

      console.log(mySkillsetsHash);

      // Add my skills to mySkillsetsHash
      _.forEach(mySkills, function(v, k) {
        console.log(v);
        mySkillsetsHash[v.skillset_id].skills.push(v)
      });

      //Create allSkillsetsHash 
      _.forEach(allSkillsets, function(v, k) {
        allSkillsetsHash[v.id] = v;
        delete allSkillsetsHash[v.id].skill_ids
        allSkillsetsHash[v.id].skills = [];
      });

      // Add all skills to allSkillsetsHash
      _.forEach(allSkills, function(v, k) {
        allSkillsetsHash[v.skillset_id].skills.push(v)
      });

      // Add active property to allSkillsetsHash
      _.forEach(mySkillsets, function(v, k) {
        allSkillsetsHash[v.id].active = true;
      });

      // Create mySkillsHash 
      _.forEach(mySkills, function(v, k) {
        v.active = true;
        mySkillsHash[v.id] = v;
      });

      //Create allSkillsHash
      _.forEach(allSkills, function(v, k) {
        mySkillsHash[v.id] ? v.active = true : v.active = false;
        allSkillsHash[v.id] = v;
      });

      // Update React state
      this.setState({
        profile: profile,
        mySkillsetsHash: mySkillsetsHash,
        allSkillsetsHash: allSkillsetsHash,
        mySkillsHash: mySkillsHash,
        allSkillsHash: allSkillsHash
      });

    }.bind(this));

    // Get the Profile Object
    function ajaxProfile() {
      return $.ajax({
        url: "http://dev.tshape.com:8000/api/profiles/1/",
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
        url: "http://dev.tshape.com:8000/api/profiles/1/skills/",
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
        url: "http://dev.tshape.com:8000/api/profiles/1/skillsets/",
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
        url: "http://dev.tshape.com:8000/api/skills/",
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
        url: "http://dev.tshape.com:8000/api/skillsets/",
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
    var allSkillsets = this.state.allSkillsetsHash;
    for (var item in allSkillsets) {
      if (allSkillsets[item].name === skillset.name) {
        return allSkillsets[item];
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
      // If the skillset does not exist, POST the skillset to the API
      // On success this will return a new skillset object with a valid ID
      $.ajax({
        url: "http://dev.tshape.com:8000/api/skillsets/",
        dataType: 'json',
        type: 'POST',
          headers: {
          'X-CSRFToken': csrfToken
        },
        data: skillset,
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

    if (this.state.mySkillsetsHash[skillset.id]) {
      console.log("Skillset already added to this profile!");
      return false;
    } else {
      var newMySkillsetsHash = this.state.mySkillsetsHash;
      var newAllSkillsetsHash = this.state.allSkillsetsHash;

      // add the skillset to mySkillsetsHash
      newMySkillsetsHash[skillset.id] = skillset
      // add a skills array to the skillset
      newMySkillsetsHash[skillset.id].skills = [];
      // update react state
      this.setState({
        mySkillsetsHash: newMySkillsetsHash
      });


      // add the skillset to allSkillsetsHash
      newAllSkillsetsHash[skillset.id] = skillset
      // set an active flag on the skillset in allSkillsetsHash
      newAllSkillsetsHash[skillset.id].active = true;
      this.setState({
        allSkillsetsHash: newAllSkillsetsHash
      });

      // Generate an array of skillset ID's to PUT to API
      var mySkillsetIds = Object.keys(this.state.mySkillsetsHash).map(function(value, key) {
        return newMySkillsetsHash[value].id
      });

      console.log("PUT skillsets", mySkillsetIds);
      // PUT the new skillset to the users profile via the API
      // The API accepts this format: {"skillset_ids": [1,2,3]}
      var data = JSON.stringify({"skillset_ids": mySkillsetIds});

      $.ajax({
        url: profileApi,
        method: "PUT",
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
    }
  },
  handleSkillsetRemove: function(skillset) {
    console.log("handleSkillsetRemove", skillset);

    var newMySkillsetsHash = this.state.mySkillsetsHash;
    var newAllSkillsetsHash = this.state.allSkillsetsHash;

    delete newMySkillsetsHash[skillset.id]
    this.setState({
      mySkillsetsHash: newMySkillsetsHash
    });

    newAllSkillsetsHash[skillset.id].active = false;
    this.setState({
      allSkillsetsHash: newAllSkillsetsHash
    });

    var mySkillsetIds = Object.keys(this.state.mySkillsetsHash).map(function(value, key) {
      return newMySkillsetsHash[value].id
    });

    var data = JSON.stringify({"skillset_ids": mySkillsetIds});

    // POST new skillsets object to API
    $.ajax({
      url: profileApi,
      method: "PUT",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      data: data,
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
      url: "http://dev.tshape.com:8000/api/skills/",
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
    
    if (this.state.mySkillsHash[skill.id]) {
      console.log("Skill already added to this profile!");
      return false;
    } else {
      var newMySkillsetsHash = this.state.mySkillsetsHash;
      var newAllSkillsetsHash = this.state.allSkillsetsHash;
      var newMySkillsHash = this.state.mySkillsHash;
      var newAllSkillsHash = this.state.allSkillsHash;

      skill.active = true;

      // add the skill to mySkillsetsHash
      newMySkillsetsHash[skill.skillset_id].skills.push(skill);
      newAllSkillsetsHash[skill.skillset_id].skills.push(skill);
      newMySkillsHash[skill.id] = skill;
      newAllSkillsHash[skill.id] = skill;

      this.setState({
        mySkillsetsHash: newMySkillsetsHash,
        allSkillsetsHash: newAllSkillsetsHash,
        mySkillsHash: newMySkillsHash,
        allSkillsHash: newAllSkillsHash,
      });

      // add the skill to the skill_ids array on profile
      var newSkillIds = Object.keys(this.state.mySkillsHash).map(function(value, key) {
        return value
      })
      
      var data = JSON.stringify({"skill_ids": newSkillIds});
      console.log("handleSkillPut skill_ids", newSkillIds)
      $.ajax({
        url: profileApi,
        method: "PUT",
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
    }
  },
  handleSkillRemove: function(skill) {
    console.log("handleSkillRemove", skill);

    var newMySkillsetsHash = this.state.mySkillsetsHash;
    var newAllSkillsetsHash = this.state.allSkillsetsHash;
    var newMySkillsHash = this.state.mySkillsHash;
    var newAllSkillsHash = this.state.allSkillsHash;

    skill.active = false;

    _.remove(newMySkillsetsHash[skill.skillset_id].skills, function(skillToRemove) {
      return skillToRemove.id === skill.id
    })

    _.remove(newAllSkillsetsHash[skill.skillset_id].skills, function(skillToRemove) {
      return skillToRemove.id === skill.id
    })

    delete newMySkillsHash[skill.id]
    newAllSkillsHash[skill.id] = skill;

    this.setState({
      mySkillsetsHash: newMySkillsetsHash,
      allSkillsetsHash: newAllSkillsetsHash,
      mySkillsHash: newMySkillsHash,
      allSkillsHash: newAllSkillsHash,
    });

    // add the skill to the skill_ids array on profile
    var newSkillIds = Object.keys(this.state.mySkillsHash).map(function(value, key) {
      return value
    })

    var data = JSON.stringify({"skill_ids": newSkillIds});
    console.log("handleSkillPut skill_ids", newSkillIds)

    // POST new skillsets object to API
    $.ajax({
      url: profileApi,
      method: "PUT",
      headers: {
        'X-CSRFToken': csrfToken,
        "content-type": "application/json"
      },
      data: data,
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
  render: function() {
    return (
      <div>
        <div className="tshape">
          <div className="tshape__header">
              <h2 className="tshape__role">UI Engineer</h2>
              <h3 className="tshape__user">Robert Austin</h3>
              <div className="tshape__badges">
                  <span className="tshape__github"><a href="#"><i className="fa fa-github" aria-hidden="true"></i></a></span>
                  <span className="tshape__linkedin"><a href="#"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a></span>
              </div>
          </div>
          <div className="tshape__middle">
            {Object.keys(this.state.mySkillsetsHash).map(function(value, key) {
              return (
                <SkillsetTshape 
                  key={key} 
                  skillset={this.state.mySkillsetsHash[value]} 
                  activeSkillset={this.state.activeSkillset} 
                />
              )
            }.bind(this))}
          </div>
        </div>
        <div>
          <hr />
          <h2>Add Skillsets</h2>
          <div className="skillsets">

            <h3>My Skillsets</h3>
            {Object.keys(this.state.mySkillsetsHash).map(function(value, key) {
              return (
                <MySkillsetItem 
                  key={key} 
                  skillset={this.state.mySkillsetsHash[value]} 
                  activeSkillset={this.state.activeSkillset} 
                  setActiveSkillset={this.setActiveSkillset} 
                  onRemove={this.handleSkillsetRemove} 
                />
              )
            }.bind(this))}

            <h3>All Skillsets</h3>
            {Object.keys(this.state.allSkillsetsHash).map(function(value, key) {
              return (
                <AllSkillsetItem 
                  key={key}
                  skillset={this.state.allSkillsetsHash[value]}  
                  activeSkillset={this.state.activeSkillset} 
                  onAdd={this.handleSkillsetCreate} 
                />
              )
            }.bind(this))}

            <h3>Add Custom Skillset</h3>
            <AddSkillset onSkillsetSubmit={this.handleSkillsetCreate} />

          </div>
          <hr />
          <h2>Add {this.state.activeSkillset.name} Skills</h2>
          <div className="skills">
              <h3>My {this.state.activeSkillset.name} Skills</h3>
              <MySkillItem 
                skillsets={this.state.allSkillsetsHash}  
                activeSkillset={this.state.activeSkillset} 
                onRemove={this.handleSkillRemove} 
              />
              <h3>All {this.state.activeSkillset.name} Skills</h3>
              <AllSkillItem 
                skillsets={this.state.allSkillsetsHash}  
                activeSkillset={this.state.activeSkillset} 
                onAdd={this.handleSkillPut} 
              />
              <AddSkill skillsets={this.state.skillsets} onSkillSubmit={this.handleSkillCreate} activeSkillset={this.state.activeSkillset}/>
          </div>
        </div>
      </div>
    );
  }
});

var SkillsetTshape = React.createClass({
    render: function(){
      return (
        <div className={"tshape__skillset " + (this.props.activeSkillset.id === this.props.skillset.id ? "active" : "inactive")} id={this.props.skillset.id}>
          <div className="tshape__skillset-heading">{this.props.skillset.name}</div>
          {this.props.skillset.skills.map(function(value, key) {
            return <SkillTshape key={key} skill={value} />
          })}
        </div>
      );
    }
});
var SkillTshape = React.createClass({
    render: function(){
      return (
        <div className="tshape__skill" id={this.props.skill.id}>
          <div className="tshape__skillname">{this.props.skill.name}</div>
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
      <li className={"skillset__item skillset__item--tag " + (this.props.activeSkillset.id === this.props.skillset.id ? "active" : "inactive") } onClick={this.setActive(this.props.skillset)}>
        <span>{this.props.skillset.name}</span>
        <a href="#" onClick={this.remove(this.props.skillset)}>remove</a>
      </li>
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
        <li className={"skillset__item active"}>
          <span>{this.props.skillset.name}</span>
        </li>
      )
    } else {
      return (
        <li className={"skillset__item inactive"}>
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
      <form className="commentForm" onSubmit={this.handleSubmit}>
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
    } else if(this.props.activeSkillset.id !== null && this.props.activeSkillset.skills.length === 0) {
      var items = <li>No my skills</li>
    } else {
      var items = this.props.activeSkillset.skills.map(function(item, i) {
        return (
          <li className="skill__item skill__item--tag" key={i}>
            <span>{item.name}</span>
             <a href="#" className="skill__link skill__link--remove" onClick={this.remove(item)}>X</a>
          </li>
        )
      }.bind(this))
    } 
    return (
      <ul>{items}</ul>
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
      var items = <li>Please select a skillset</li>
    } else if(this.props.activeSkillset.id !== null && this.props.activeSkillset.skills.length === 0) {
      var items = <li>No all skills</li>
    } else {
      var items = this.props.skillsets[this.props.activeSkillset.id].skills.map(function(item, i) {
        if (item.active) {
          return (
            <li className={"skillset__item active"} key={i}>
              <span>{item.name}</span>
            </li>
          )
        } else {
          return (
            <li className={"skill__item inactive"} key={i} >
               <a href="#" className="skill__link" onClick={this.add(item)}>{item.name}</a>
            </li>
          )
        }
        
      }.bind(this))
    } 
    return (
      <ul>{items}</ul>
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
      <form className="commentForm" onSubmit={this.handleSubmit}>
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

ReactDOM.render(
<Profile url={profileApi} />,
  document.getElementById('tshape')
);
