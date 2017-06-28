<?php
namespace Grav\Plugin;

use Grav\Common\GPM\GPM;
use Grav\Common\Grav;
use Grav\Common\Page\Page;
use Grav\Common\Page\Pages;
use Grav\Common\Plugin;
use Grav\Common\Uri;
use RocketTheme\Toolbox\File\File;
use RocketTheme\Toolbox\Event\Event;
use RocketTheme\Toolbox\Session\Session;
use Symfony\Component\Yaml\Yaml as YamlParser;

class AvenueAdminPlugin extends Plugin
{
	protected $venues_route = 'venues';
	protected $events_route = 'events';

	/**
	 * @return array
	 */
	public static function getSubscribedEvents() {
		return [
			'onPluginsInitialized' => ['onPluginsInitialized', 0],
		];
	}

	/**
	 * Enable only if url matches to the configuration.
	 */
	public function onPluginsInitialized() {
		if (!$this->isAdmin()) {
			return;
		}

		$uri = $this->grav['uri'];

		$this->enable([
			'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
			'onTwigSiteVariables' => ['onTwigSiteVariables', 0],
			'onAdminMenu'         => ['onAdminMenu', 0],
		]);

		if (strpos($uri->path(), $this->config->get('plugins.admin.route') . '/' . $this->venues_route) === false || strpos($uri->path(), $this->config->get('plugins.admin.route') . '/' . $this->events_route) === false) {
			return;
		}

		if (isset($uri->paths()[1]) && $uri->paths()[1] == $this->route) {
			$type = null;
			$file = null;

			if (isset($uri->paths()[2])) {
				$type = $uri->paths()[2];
			}
			if (isset($uri->paths()[3])) {
				$file = $uri->paths()[3];
			}

			if ($file) {
				$fileRoute = $uri->paths()[3];

				/** @var Twig $twig */
				$twig = $this->grav['twig'];
				$this->grav['twig']->itemData = $this->getFileContentFromRoute($type, $fileRoute);

			} elseif (isset($uri->paths()[2])) {
				//List of items of a type

				$items = [];
				$entry = null;
				if ($handle = opendir(DATA_DIR . $type)) {
					while (false !== ($entry = readdir($handle))) {
						if ($entry[0] != "." && $entry != "..") {
							$fileRoute = substr($entry, 0, strrpos($entry, '.'));
							$items[] = [
								'route' => $fileRoute,
								'content' => $this->getFileContentFromRoute($type, $fileRoute)
							];
						}
					}
					closedir($handle);
				}

				$this->grav['twig']->items = $items;
			} else {
				//Types list
				$types = [];
				$entry = null;

				//Find data types excluded by plugins
				$this->grav->fireEvent('onDataTypeExcludeFromDataManagerPluginHook');

				$typesIterator = new \FilesystemIterator(DATA_DIR, \FilesystemIterator::SKIP_DOTS);
				foreach ($typesIterator as $type) {
					$typeName = $type->getFilename();
					if ($typeName[0] == '.') continue;

					$iterator = new \FilesystemIterator(DATA_DIR . $typeName, \FilesystemIterator::SKIP_DOTS);
					$count = 0;
					foreach ($iterator as $fileinfo) {
						if ($fileinfo->getFilename()[0] == '.') continue;
						$count++;
					}

					if (isset($this->grav['admin']->dataTypesExcludedFromDataManagerPlugin)) {
						if (!in_array($typeName, $this->grav['admin']->dataTypesExcludedFromDataManagerPlugin)) {
							$types[$typeName] = $count;
						}
					} else {
						$types[$typeName] = $count;
					}
				}

				$this->grav['twig']->types = $types;
			}
		}

	}

	public function onTwigSiteVariables() {
		if($this->config->get('plugins.avenue-admin.built_in_js')) {

			$this->grav['assets']
				->addCss('plugin://avenue-admin/admin/assets/css/avenue-admin.css')
				->addCSS('//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css');
		}

	}

	/**
	 * Add plugin templates path
	 */
	public function onTwigTemplatePaths() {
		$this->grav['twig']->twig_paths[] = __DIR__ . '/admin/templates';
	}

	/**
	 * Add navigation item to the admin plugin
	 */
	public function onAdminMenu() {
		$this->grav['twig']->plugins_hooked_nav['PLUGIN_AVENUE_ADMIN.AVENUE_ADMIN_VENUES'] = ['route' => $this->venues_route, 'icon' => 'fa-map-marker'];
		$this->grav['twig']->plugins_hooked_nav['PLUGIN_AVENUE_ADMIN.AVENUE_ADMIN_EVENTS'] = ['route' => $this->events_route, 'icon' => 'fa-users'];
	}
}
