// Generated by CoffeeScript 1.6.2
"use strict";
var fs;

fs = require('fs');

module.exports = function(grunt) {
  var append, back_to_top, generate_TOC, generate_banner, generate_footer, generate_release_history, generate_title, get_file_extension, get_latest_changelog, is_valid_extention, make_anchor, pkg;

  pkg = grunt.config.get(['pkg']);
  if (pkg == null) {
    grunt.fail.fatal("The package configuration is missing. Please add `pkg: grunt.file.readJSON('package.json')` to your grunt init in Gruntfile; or provide a `pkg` object in `grunt.config` with package name and description.");
  }
  make_anchor = function(string) {
    var str;

    str = string.replace(/\s+/g, '-').toLowerCase();
    return str = "#" + str;
  };
  back_to_top = function(travis) {
    var result, str;

    str = make_anchor(pkg.name);
    if (travis) {
      str += "-";
    }
    return result = "\[[Back To Top]\](" + str + ")";
  };
  get_file_extension = function(file) {
    var ext;

    ext = file.split('.').pop();
    return ext;
  };
  is_valid_extention = function(file) {
    var ext;

    ext = get_file_extension(file);
    if (ext.toLowerCase() === "md" || ext.toLowerCase() === "markdown" || ext.toLowerCase() === "mdown") {
      return true;
    } else {
      return false;
    }
  };
  get_latest_changelog = function(opts) {
    var changelog_folder, filename, files, latest, prefix, versions_found, _i, _len;

    prefix = opts.changelog_version_prefix;
    changelog_folder = opts.changelog_folder;
    versions_found = [];
    files = fs.readdirSync(changelog_folder);
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      filename = files[_i];
      if (filename.substring(0, prefix.length) === prefix && grunt.file.isFile(changelog_folder + "/" + filename) && is_valid_extention(filename)) {
        versions_found.push(filename);
      }
    }
    if (versions_found.length > 0) {
      versions_found.sort();
      latest = versions_found[versions_found.length - 1];
      return latest;
    } else {
      grunt.fail.fatal("No changelogs are present. Please write a changelog file or fix prefixes.");
      return false;
    }
  };
  generate_banner = function(opts) {
    var banner_file, f, output, path;

    path = opts.readme_folder;
    banner_file = opts.banner;
    output = opts.output;
    f = path + "/" + banner_file;
    if (!grunt.file.exists(f)) {
      return grunt.fail.fatal("Source file \"" + f + "\" not found.");
    } else {
      fs.appendFileSync(output, grunt.file.read(f));
      return fs.appendFileSync(output, "\n");
    }
  };
  generate_TOC = function(files, opts) {
    var changelog_insert_before, ex, file, i, link, output, release_title, title, toc_extra_links, _i, _len;

    toc_extra_links = opts.toc_extra_links;
    changelog_insert_before = opts.changelog_insert_before;
    output = opts.output;
    fs.appendFileSync(output, "## Jump to Section\n\n");
    for (file in files) {
      title = files[file];
      if (file === changelog_insert_before && opts.generate_release_history) {
        release_title = make_anchor("Release History");
        fs.appendFileSync(output, "* [Release History](" + release_title + ")\n");
        link = make_anchor(title);
        fs.appendFileSync(output, "* [" + title + "](" + link + ")\n");
      } else {
        link = make_anchor(title);
        fs.appendFileSync(output, "* [" + title + "](" + link + ")\n");
      }
    }
    if (toc_extra_links.length > 0) {
      for (_i = 0, _len = toc_extra_links.length; _i < _len; _i++) {
        i = toc_extra_links[_i];
        ex = i;
        fs.appendFileSync(output, "* " + ex + "\n");
      }
    }
    return fs.appendFileSync(output, "\n");
  };
  generate_title = function(opts) {
    var desc, output, title, tra, travis, username;

    output = opts.output;
    travis = opts.has_travis;
    username = opts.github_username;
    title = pkg.name;
    desc = pkg.description;
    fs.appendFileSync(output, "# " + title + " ");
    if (travis) {
      tra = "[![Build Status](https://secure.travis-ci.org/" + username + "/" + title + ".png?branch=master)](http://travis-ci.org/" + username + "/" + title + ")";
      fs.appendFileSync(output, "" + tra);
    }
    return fs.appendFileSync(output, "\n\n> " + desc + "\n\n");
  };
  append = function(opts, file, title) {
    var f, output, path, top, travis;

    path = opts.readme_folder;
    travis = opts.has_travis;
    output = opts.output;
    fs.appendFileSync(output, "## " + title + "\n");
    if (opts.table_of_contents) {
      top = back_to_top(travis);
      fs.appendFileSync(output, "" + top + "\n");
    }
    fs.appendFileSync(output, "\n");
    f = path + "/" + file;
    if (!grunt.file.exists(f)) {
      return grunt.fail.fatal("Source file \"" + f + "\" not found.");
    } else {
      fs.appendFileSync(output, grunt.file.read(f));
      return fs.appendFileSync(output, "\n\n");
    }
  };
  generate_release_history = function(opts) {
    var changelog_folder, latest, latest_extension, latest_file, latest_version, output, prefix, top, travis;

    prefix = opts.changelog_version_prefix;
    changelog_folder = opts.changelog_folder;
    travis = opts.has_travis;
    output = opts.output;
    fs.appendFileSync(output, "## Release History\n");
    if (opts.table_of_contents) {
      top = back_to_top(travis);
      fs.appendFileSync(output, "" + top + "\n");
    }
    fs.appendFileSync(output, "\nYou can find [all the changelogs here](/" + changelog_folder + ").\n\n");
    latest = get_latest_changelog(opts);
    latest_file = changelog_folder + "/" + latest;
    latest_extension = get_file_extension(latest);
    latest_version = latest.slice(prefix.length, -latest_extension.length - 1);
    fs.appendFileSync(output, "### Latest changelog is for [" + latest + "](/" + latest_file + "):\n\n");
    if (!grunt.file.exists(latest_file)) {
      return grunt.fail.fatal("Changelog file \"" + latest_file + "\" not found.");
    } else {
      fs.appendFileSync(output, grunt.file.read(latest_file));
      return fs.appendFileSync(output, "\n");
    }
  };
  generate_footer = function(opts) {
    var date, output, str;

    output = opts.output;
    date = new Date();
    str = "\n\n--------\n<small>_This readme has been automatically generated by [readme generator](https://github.com/aponxi/grunt-readme-generator) on " + date + "._</small>";
    return fs.appendFileSync(output, str);
  };
  return grunt.registerMultiTask("readme_generator", "Generate Readme File", function() {
    var file, files, options, title;

    options = this.options({
      github_username: "aponxi",
      output: "README.md",
      table_of_contents: true,
      readme_folder: "readme",
      changelog_folder: "changelogs",
      changelog_version_prefix: "v",
      changelog_insert_before: "legal.md",
      toc_extra_links: [],
      banner: null,
      has_travis: true,
      generate_footer: true,
      generate_changelog: true
    });
    grunt.file.write(options.output, "");
    files = this.data.order;
    if (options.banner != null) {
      generate_banner(options);
    }
    generate_title(options);
    if (options.table_of_contents) {
      generate_TOC(files, options);
    }
    for (file in files) {
      title = files[file];
      if (file === options.changelog_insert_before && options.generate_changelog) {
        generate_release_history(options);
      }
      append(options, file, title);
    }
    if (options.generate_footer) {
      generate_footer(options);
    }
    return grunt.log.writeln("File \"" + options.output + "\" created.");
  });
};
